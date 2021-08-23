import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import GridCellProperties from '../types/GridCellProperties';
import { GridInterface, Position } from '../types/GridModel';

interface UseCreateGridResponse extends GridInterface {
  setRows: Dispatch<SetStateAction<number>>;
  setCols: Dispatch<SetStateAction<number>>;
  setAutoSymmetry: Dispatch<SetStateAction<boolean>>;
  setBlockMode: Dispatch<SetStateAction<boolean>>;
  setHoverMode: Dispatch<SetStateAction<boolean>>;
  toggleBlock: (cell: GridCellProperties) => void;
  onHover: (cell: GridCellProperties) => void;

  table?: GridCellProperties[][];
  blockMode: boolean;
  autoSymmetry: boolean;
  showHoverMode: boolean;
}

const updateBlocks = (
  blocks: Position[],
  cell: { rowNum: number; colNum: number }
): Position[] => {
  const cellIndex = blocks.findIndex(
    ({ x, y }) => x === cell.rowNum && y === cell.colNum
  );

  if (cellIndex < 0) {
    return [...blocks, { x: cell.rowNum, y: cell.colNum }];
  }

  const newBlocks = [...blocks];
  newBlocks.splice(cellIndex, 1);

  return newBlocks;
};

const getInverseCellPosition = (
  rows: number,
  cols: number,
  cell?: { rowNum?: number; colNum?: number }
): Position | undefined =>
  cell && cell.rowNum >= 0 && cell?.colNum >= 0
    ? {
        x: rows - 1 - cell.rowNum,
        y: cols - 1 - cell.colNum,
      }
    : undefined;

// TODO: Call useQuery to fetch grid. Change param to grid id instead.
const useCreateGrid = (grid?: GridInterface): UseCreateGridResponse => {
  const [rows, setRows] = useState(grid?.rows || 15);
  const [cols, setCols] = useState(grid?.cols || 15);
  const [blocks, setBlocks] = useState(grid?.blocks || []);
  const [autoSymmetry, setAutoSymmetry] = useState(true);
  const [showHoverMode, setHoverMode] = useState(true);
  const [blockMode, setBlockMode] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<
    GridCellProperties | undefined
  >(undefined);

  const toggleBlock = useCallback(
    (cell: GridCellProperties) => {
      setBlocks((blocks) => {
        let newBlocks = updateBlocks(blocks, cell);

        if (autoSymmetry) {
          const inverseCell = getInverseCellPosition(rows, cols, cell);

          if (inverseCell.x !== cell.rowNum || inverseCell.y !== cell.colNum) {
            newBlocks = updateBlocks(newBlocks, {
              rowNum: inverseCell.x,
              colNum: inverseCell.y,
            });
          }
        }

        return newBlocks;
      });
    },
    [autoSymmetry, rows, cols]
  );

  const onHover = useCallback((cell: GridCellProperties) => {
    setHoveredCell(cell);
  }, []);

  const table: GridCellProperties[][] = useMemo(() => {
    if (!rows || !cols) {
      return undefined;
    }

    return Array.from(new Array(rows)).map((_, rowNum) =>
      Array.from(new Array(cols)).map(
        (_, colNum) =>
          ({
            rowNum,
            colNum,
            block: !!blocks.find(({ x, y }) => x === rowNum && y === colNum),
            isBlockHighlighted:
              hoveredCell &&
              ((hoveredCell.rowNum === rowNum &&
                hoveredCell.colNum === colNum) ||
                (autoSymmetry &&
                  rows - 1 - hoveredCell.rowNum === rowNum &&
                  cols - 1 - hoveredCell.colNum === colNum)),
          } as GridCellProperties)
      )
    );
  }, [rows, cols, hoveredCell, blocks, autoSymmetry]);

  return {
    rows,
    cols,
    rootCells: [],
    blocks,
    autoSymmetry,
    table,
    blockMode,
    showHoverMode,

    setRows,
    setCols,
    setAutoSymmetry,
    setBlockMode,
    onHover,
    toggleBlock,
    setHoverMode,
  };
};

export default useCreateGrid;
