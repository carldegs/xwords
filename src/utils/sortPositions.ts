import { Position } from '../types/GridModel';

const sortPositions = <T extends Position>(positions: T[]): T[] =>
  positions.sort((a, b) => {
    if (a.x == b.x) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });

export default sortPositions;
