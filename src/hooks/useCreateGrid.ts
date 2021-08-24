import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import CellCoverage from '../types/CellCoverage';
import GridCellProperties from '../types/GridCellProperties';
import { GridInterface, Position, RootCell } from '../types/GridModel';
import createCoverageMap from '../utils/createCoverageMap';
import createPositionsTable from '../utils/createPositionsTable';
import createRootCells from '../utils/createRootCells';
import sortPositions from '../utils/sortPositions';

type CellEventHandler = (cell: GridCellProperties) => void;

interface UseCreateGridResponse extends GridInterface {
  setRows: Dispatch<SetStateAction<number>>;
  setCols: Dispatch<SetStateAction<number>>;
  setAutoSymmetry: Dispatch<SetStateAction<boolean>>;
  setBlockMode: Dispatch<SetStateAction<boolean>>;
  setHoverMode: Dispatch<SetStateAction<boolean>>;
  toggleBlock: CellEventHandler;
  selectCell: CellEventHandler;
  onHover: CellEventHandler;

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
  const [rows, setRows] = useState(grid?.rows || 0);
  const [cols, setCols] = useState(grid?.cols || 0);
  const [blocks, setBlocks] = useState(grid?.blocks || []);
  const [rootCells, setRootCells] = useState(grid?.rootCells || []);
  const [rootCellTable, setRootCellTable] = useState([]);
  const [cellCoverageMap, setCellCoverageMap] = useState<CellCoverage[][]>([]);
  const [autoSymmetry, setAutoSymmetry] = useState(true);
  const [showHoverMode, setHoverMode] = useState(true);
  const [blockMode, _setBlockMode] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<
    GridCellProperties | undefined
  >(undefined);
  const [selectedCell, setSelectedCell] = useState<
    GridCellProperties | undefined
  >(undefined);
  const [wordMode, setWordMode] = useState<keyof CellCoverage>('across');

  const blockTable = useMemo(
    () => createPositionsTable(blocks, rows, cols) as number[][],
    [blocks, rows, cols]
  );

  useEffect(() => {
    const newRootCells = sortPositions(createRootCells(blockTable));
    setRootCells(newRootCells);
    setRootCellTable(
      createPositionsTable(newRootCells, rows, cols, {
        returnData: true,
        skipSort: true,
      })
    );
    setCellCoverageMap(createCoverageMap(newRootCells, rows, cols, true));
  }, [blockTable, rows, cols]);

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

  const selectCell = useCallback(
    (cell: GridCellProperties) => {
      if (
        selectedCell?.rowNum === cell.rowNum &&
        selectedCell?.colNum === cell.colNum
      ) {
        setWordMode((mode) => (mode === 'across' ? 'down' : 'across'));
      }

      setSelectedCell(cell);
    },
    [selectedCell]
  );

  const setBlockMode = useCallback((isBlockMode) => {
    if (isBlockMode) {
      setSelectedCell(undefined);
    }

    _setBlockMode(isBlockMode);
  }, []);

  const onHover = useCallback((cell: GridCellProperties) => {
    setHoveredCell(cell);
  }, []);

  const table: GridCellProperties[][] = useMemo(() => {
    if (!rows || !cols) {
      return undefined;
    }

    return Array.from(new Array(rows)).map((_, rowNum) =>
      Array.from(new Array(cols)).map((_, colNum) => {
        const rootCell: RootCell | undefined =
          rootCellTable?.length && rootCellTable[rowNum][colNum];
        const rootnum = rootCell?.index;

        const isSelected =
          selectedCell &&
          selectedCell.rowNum === rowNum &&
          selectedCell.colNum === colNum;
        const coverage =
          cellCoverageMap.length && cellCoverageMap[rowNum][colNum];
        const isWordHighlighted =
          !isSelected &&
          selectedCell?.coverage &&
          coverage &&
          coverage[wordMode] === selectedCell.coverage[wordMode];
        const isRootnumHighlighted =
          (isSelected || isWordHighlighted) &&
          coverage &&
          coverage[wordMode] === rootCell?.index;

        return {
          rowNum,
          colNum,
          rootnum,
          block: !!blockTable[rowNum][colNum],
          isBlockHighlighted:
            hoveredCell &&
            ((hoveredCell.rowNum === rowNum && hoveredCell.colNum === colNum) ||
              (blockMode &&
                autoSymmetry &&
                rows - 1 - hoveredCell.rowNum === rowNum &&
                cols - 1 - hoveredCell.colNum === colNum)),
          isHighlighted: isSelected,
          coverage,
          isWordHighlighted,
          isRootnumHighlighted,
        } as GridCellProperties;
      })
    );
  }, [
    rows,
    cols,
    hoveredCell,
    autoSymmetry,
    blockTable,
    rootCellTable,
    blockMode,
    cellCoverageMap,
    selectedCell,
    wordMode,
  ]);

  return {
    rows,
    cols,
    rootCells,
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
    selectCell,
  };
};

export default useCreateGrid;
