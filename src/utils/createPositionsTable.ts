import { Position } from '../types/GridModel';
import sortPositions from './sortPositions';

interface CreatePositionsTableOptions {
  skipSort?: boolean;
  returnData?: boolean;
}

const createPositionsTable = <T extends Position>(
  blocks: T[],
  numRows: number,
  numCols: number,
  options: CreatePositionsTableOptions = {}
): (number | T)[][] => {
  let b = 0;
  let sortedBlocks = [...blocks];
  const { skipSort = false, returnData = false } = options;

  if (!skipSort) {
    sortedBlocks = sortPositions(blocks);
  }

  return Array.from(new Array(numRows)).map((_, r) =>
    Array.from(new Array(numCols)).map((_, c) => {
      const block = b < sortedBlocks.length && sortedBlocks[b];

      if (block && block.x === r && block.y === c) {
        b++;
        return returnData ? block : 1;
      }

      return 0;
    })
  );
};

export default createPositionsTable;
