import { Position, RootCell } from '../types/GridModel';
import createPositionsTable from './createPositionsTable';

export const createRootCellsFromBlocks = (
  blocks: Position[],
  numRows: number,
  numCols: number
): RootCell[] => {
  const blockTable = createPositionsTable(blocks, numRows, numCols);
  return createRootCells(blockTable as number[][]);
};

const createRootCells = (blockTable: number[][]): RootCell[] => {
  let rootCells: RootCell[] = [];
  let index = 0;

  blockTable.forEach((row, r) =>
    row.forEach((col, c) => {
      if (!col) {
        const hasLeftBlock = c === 0 || !!blockTable[r][c - 1];
        const hasTopBlock = r === 0 || !!blockTable[r - 1][c];

        if (hasLeftBlock || hasTopBlock) {
          index += 1;

          let rootCell: RootCell = {
            x: r,
            y: c,
            index,
          };

          if (hasLeftBlock) {
            let length = 0;
            for (let i = c; i < row.length; i++) {
              if (row[i] === 1) {
                break;
              }

              length++;
            }

            rootCell = {
              ...rootCell,
              across: {
                length,
              },
            };
          }

          if (hasTopBlock) {
            let length = 0;
            for (let i = r; i < blockTable.length; i++) {
              if (blockTable[i][c] === 1) {
                break;
              }

              length++;
            }
            rootCell = {
              ...rootCell,
              down: {
                length,
              },
            };
          }

          rootCells = [...rootCells, rootCell];
        }
      }
    })
  );

  return rootCells;
};

export default createRootCells;
