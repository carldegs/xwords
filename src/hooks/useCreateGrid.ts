import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import CellCoverage from '../types/CellCoverage';
import Direction from '../types/Direction';
import GridCellProperties from '../types/GridCellProperties';
import { Clue, GridInterface, Position, RootCell } from '../types/GridModel';
import createCoverageMap from '../utils/createCoverageMap';
import createPositionsTable from '../utils/createPositionsTable';
import createRootCells from '../utils/createRootCells';
import sortPositions from '../utils/sortPositions';
import updateClue from '../utils/updateClue';

type CellEventHandler = (cell: GridCellProperties) => void;

export interface UseCreateGridResponse extends GridInterface {
  setRows: Dispatch<SetStateAction<number>>;
  setCols: Dispatch<SetStateAction<number>>;
  setAutoSymmetry: Dispatch<SetStateAction<boolean>>;
  setBlockMode: Dispatch<SetStateAction<boolean>>;
  setHoverMode: Dispatch<SetStateAction<boolean>>;
  toggleBlock: CellEventHandler;
  selectCell: CellEventHandler;
  onHover: CellEventHandler;
  onClueTextChange: (clue: string, index: number, direction: Direction) => void;
  onClueAnswerChange: (
    answer: string[],
    index: number,
    direction: Direction
  ) => void;
  resetGrid: () => void;
  onCellValueChange: (cell: GridCellProperties, value: string) => void;
  wordMode: Direction;
  moveSelectedCell: (grid: GridCellProperties, value: string) => void;

  table?: GridCellProperties[][];
  clues: Record<string, Clue>;
  selectedClue?: Record<string, Clue>;
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
const useCreateGrid = (
  grid?: GridInterface,
  _clues?: Record<string, Clue>
): UseCreateGridResponse => {
  const [rows, setRows] = useState(grid?.rows || 0);
  const [cols, setCols] = useState(grid?.cols || 0);
  const [blocks, setBlocks] = useState(grid?.blocks || []);
  const [rootCells, setRootCells] = useState(grid?.rootCells || []);
  const [rootCellTable, setRootCellTable] = useState([]);
  const [cellCoverageMap, setCellCoverageMap] = useState<CellCoverage[][]>([]);
  const [autoSymmetry, setAutoSymmetry] = useState(true);
  const [showHoverMode, setHoverMode] = useState(true);
  const [blockMode, _setBlockMode] = useState(true);
  const [clues, setClues] = useState(_clues || {});
  const [hoveredCell, setHoveredCell] = useState<
    GridCellProperties | undefined
  >(undefined);
  const [selectedCell, setSelectedCell] = useState<
    GridCellProperties | undefined
  >(undefined);
  const [wordMode, setWordMode] = useState<Direction>('across');

  const blockTable = useMemo(
    () => createPositionsTable(blocks, rows, cols) as number[][],
    [blocks, rows, cols]
  );

  useEffect(() => {
    const newRootCells = sortPositions(createRootCells(blockTable));
    const coverageMap = createCoverageMap(newRootCells, rows, cols, true);
    setRootCells(newRootCells);
    setRootCellTable(
      createPositionsTable(newRootCells, rows, cols, {
        returnData: true,
        skipSort: true,
      })
    );
    setCellCoverageMap(coverageMap);

    // TODO: Unlink clue to root cell instead of modifying it.
    setClues((clues) => {
      let newClues: Record<string, Clue> = {};

      newRootCells.forEach(({ index, across, down }) => {
        let newAcrossClue: Clue | undefined = undefined;
        let newDownClue: Clue | undefined = undefined;

        if (across?.length) {
          const currAcrossClue = clues[`${index}/across`];
          if (currAcrossClue?.answer?.length) {
            if (across?.length === currAcrossClue?.answer?.length) {
              newAcrossClue = { ...currAcrossClue };
            } else {
              newAcrossClue = {
                ...currAcrossClue,
                answer: Array.from(new Array(across.length)).map((_, i) =>
                  i < currAcrossClue.answer.length
                    ? currAcrossClue.answer[i]
                    : ''
                ),
              };
            }
          } else {
            newAcrossClue = {
              clue: '',
              answer: Array.from(new Array(across.length)).fill(''),
            };
          }
        }

        if (down?.length) {
          const currDownClue = clues[`${index}/down`];

          if (currDownClue?.answer?.length) {
            if (down?.length === currDownClue?.answer?.length) {
              newDownClue = { ...currDownClue };
            } else {
              newDownClue = {
                ...currDownClue,
                answer: Array.from(new Array(down.length)).map((_, i) =>
                  i < currDownClue.answer.length ? currDownClue.answer[i] : ''
                ),
              };
            }
          } else {
            newDownClue = {
              clue: '',
              answer: Array.from(new Array(down.length)).fill(''),
            };
          }
        }

        newClues = {
          ...newClues,
          ...(newAcrossClue ? { [`${index}/across`]: newAcrossClue } : {}),
          ...(newDownClue ? { [`${index}/down`]: newDownClue } : {}),
        };
      });

      coverageMap?.forEach((row) =>
        row.forEach((cell) => {
          const { across, down } = cell || {};
          if (across?.wordLength && down?.wordLength) {
            const acrossKey = `${across.rootnum}/across`;
            const downKey = `${down.rootnum}/down`;
            const acrossClue = newClues[acrossKey];
            const downClue = newClues[downKey];

            if (
              acrossClue.answer[across.position] !==
              downClue.answer[down.position]
            ) {
              newClues = {
                ...newClues,
                [acrossKey]: {
                  ...newClues[acrossKey],
                  answer: newClues[acrossKey].answer.map((a, i) =>
                    i === across.position ? '' : a
                  ),
                },
                [downKey]: {
                  ...newClues[downKey],
                  answer: newClues[downKey].answer.map((a, i) =>
                    i === down.position ? '' : a
                  ),
                },
              };
            }
          }
        })
      );

      return newClues;
    });
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

  const moveSelectedCell = useCallback(
    (grid: GridCellProperties, backward = false) => {
      let newX = grid.rowNum;
      let newY = grid.colNum;
      let iter = 0;

      do {
        if (!backward && newX === rows - 1 && newY === cols - 1) {
          newX = 0;
          newY = 0;
        } else if (backward && newX === 0 && newY === 0) {
          newX = rows - 1;
          newY = rows - 1;
        } else if (wordMode === 'across') {
          newY += backward ? -1 : 1;

          if (newY >= cols || newY < 0) {
            newY = backward ? cols - 1 : 0;
            newX += backward ? -1 : 1;
          }
        } else if (wordMode === 'down') {
          newX += backward ? -1 : 1;

          if (newX >= rows || newX < 0) {
            newX = backward ? rows - 1 : 0;
            newY += backward ? -1 : 1;
          }
        }

        iter++;
      } while (blockTable && blockTable[newX][newY] && iter < rows * cols + 1);

      setSelectedCell({
        rowNum: newX,
        colNum: newY,
        coverage: cellCoverageMap ? cellCoverageMap[newX][newY] : {},
      });
    },
    [rows, cols, cellCoverageMap, blockTable, wordMode]
  );

  const onCellValueChange = useCallback(
    (grid: GridCellProperties, value: string) => {
      const key = `${grid.coverage[wordMode].rootnum}/${wordMode}`;
      const oppWordMode = wordMode === 'across' ? 'down' : 'across';
      const oppKey = `${grid.coverage[oppWordMode].rootnum}/${oppWordMode}`;
      const finalValue = value?.toUpperCase() || '';

      setClues((clues) => ({
        ...clues,
        [key]: updateClue(grid.coverage[wordMode], finalValue, clues[key]),
        [oppKey]: updateClue(
          grid.coverage[oppWordMode],
          finalValue,
          clues[oppKey]
        ),
      }));

      moveSelectedCell(grid, !value);
    },
    [wordMode, moveSelectedCell]
  );

  const onClueAnswerChange = useCallback(
    (answer: string[], index: number, direction: Direction) => {
      const key = `${index}/${direction}`;
      const rootCell = rootCells.find(
        ({ index: rootCellIndex }) => rootCellIndex === index
      );
      const isAcross = wordMode === 'across';

      setClues((clues) => {
        let newClues = {
          ...clues,
          [key]: {
            ...clues[key],
            answer,
          },
        };

        for (
          let z = !isAcross ? rootCell.x : rootCell.y;
          z < answer.length;
          z++
        ) {
          const coverage =
            cellCoverageMap[isAcross ? rootCell.x : z][
              isAcross ? z : rootCell.y
            ];
          const oppCoverage = coverage[isAcross ? 'down' : 'across'];
          const oppKey = `${oppCoverage.rootnum}/${
            isAcross ? 'down' : 'across'
          }`;
          newClues = {
            ...newClues,
            [oppKey]: updateClue(
              oppCoverage,
              answer[z - (!isAcross ? rootCell.x : rootCell.y)],
              clues[oppKey]
            ),
          };
        }

        return newClues;
      });
    },
    [cellCoverageMap, rootCells, wordMode]
  );

  const onClueTextChange = useCallback(
    (clue: string, index: number, direction: Direction) => {
      const key = `${index}/${direction}`;

      setClues((clues) => ({
        ...clues,
        [key]: {
          ...clues[key],
          clue,
        },
      }));
    },
    []
  );

  const onHover = useCallback((cell: GridCellProperties) => {
    setHoveredCell(cell);
  }, []);

  const resetGrid = useCallback(() => {
    setBlocks([]);
    setRootCells([]);
    setRootCellTable([]);
    setCellCoverageMap([]);
    setHoveredCell(undefined);
    setSelectedCell(undefined);
    setClues({});
  }, []);

  const selectedClue = useMemo(() => {
    const index = selectedCell?.coverage[wordMode].rootnum;

    if (!index) {
      return;
    }

    return {
      [`${index}/${wordMode}`]: { ...clues[`${index}/${wordMode}`] },
    };
  }, [selectedCell, clues, wordMode]);

  const table: GridCellProperties[][] = useMemo(() => {
    if (!rows || !cols) {
      return undefined;
    }

    return Array.from(new Array(rows)).map((_, rowNum) =>
      Array.from(new Array(cols)).map((_, colNum) => {
        const rootCell: RootCell | undefined =
          rootCellTable?.length && rootCellTable[rowNum][colNum];
        const rootnum = rootCell?.index;
        const isSelected = !!(
          selectedCell &&
          selectedCell.rowNum === rowNum &&
          selectedCell.colNum === colNum
        );
        const coverage =
          cellCoverageMap.length && cellCoverageMap[rowNum][colNum];
        const coverageParams = coverage && coverage[wordMode];
        const isWordHighlighted =
          !isSelected &&
          selectedCell?.coverage &&
          coverageParams?.rootnum === selectedCell.coverage[wordMode].rootnum;
        const isRootnumHighlighted =
          (isSelected || isWordHighlighted) &&
          coverageParams.rootnum === rootCell?.index;
        const block = !!blockTable[rowNum][colNum];

        let value: string;
        if (!block && !!coverageParams) {
          const clue: Clue = clues[`${coverageParams.rootnum}/${wordMode}`];

          if (clue && coverageParams) {
            value = clue?.answer[coverageParams.position] || '';
          }
        }

        return {
          rowNum,
          colNum,
          rootnum,
          block,
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
          value,
          isSelected,
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
    clues,
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
    clues,
    selectedClue,
    wordMode,

    setRows,
    setCols,
    setAutoSymmetry,
    setBlockMode,
    onHover,
    toggleBlock,
    setHoverMode,
    selectCell,
    resetGrid,
    onCellValueChange,
    onClueAnswerChange,
    onClueTextChange,
    moveSelectedCell,
  };
};

export default useCreateGrid;
