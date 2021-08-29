import CellCoverage from '../types/CellCoverage';
import Direction from '../types/Direction';
import { Position, RootCell } from '../types/GridModel';
import sortPositions from './sortPositions';

const createCoverageMap = (
  rootCells: RootCell[],
  numRows: number,
  numCols: number,
  skipSort = false
): CellCoverage[][] => {
  let sortedRootCells = [...rootCells];

  if (!skipSort) {
    sortedRootCells = sortPositions(rootCells);
  }

  let cellCoverage: (Position & {
    index: number;
    type: Direction;
    relPos: number;
    wordLength: number;
  })[] = [];

  sortedRootCells.forEach((rc) => {
    if (rc?.across) {
      Array.from(new Array(rc.across.length)).forEach((_, i) => {
        cellCoverage = [
          ...cellCoverage,
          {
            x: rc.x,
            y: rc.y + i,
            index: rc.index,
            type: 'across',
            relPos: i,
            wordLength: rc.across.length,
          },
        ];
      });
    }

    if (rc.down) {
      Array.from(new Array(rc.down.length)).forEach((_, i) => {
        cellCoverage = [
          ...cellCoverage,
          {
            x: rc.x + i,
            y: rc.y,
            index: rc.index,
            type: 'down',
            relPos: i,
            wordLength: rc.down.length,
          },
        ];
      });
    }
  });

  cellCoverage = sortPositions(cellCoverage);

  let cc = 0;

  return Array.from(new Array(numRows)).map((_, r) =>
    Array.from(new Array(numCols)).map((_, c) => {
      let cell = cc < cellCoverage.length && cellCoverage[cc];

      let covered: CellCoverage = {};

      while (cell && cell.x === r && cell.y === c) {
        cc += 1;
        covered = {
          ...covered,
          [cell.type]: {
            rootnum: cell.index,
            position: cell.relPos,
            wordLength: cell.wordLength,
          },
        };
        cell = cc < cellCoverage.length && cellCoverage[cc];
      }

      return covered?.across || covered?.down ? covered : undefined;
    })
  );
};

export default createCoverageMap;
