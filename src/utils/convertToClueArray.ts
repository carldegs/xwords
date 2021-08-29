import Direction from '../types/Direction';
import { Clue } from '../types/GridModel';

export interface ClueArrayItem {
  clue?: string;
  answer?: string[];
  index: number;
  direction: Direction;
}

export const parseClues = (
  clues?: Record<`${number}/${Direction}`, Clue>
): ClueArrayItem[] =>
  clues
    ? Object.entries<Clue>(clues).map(([key, value]) => {
        const [index, direction] = key.split('/');

        return {
          index: +index,
          direction: direction as Direction,
          ...value,
        };
      })
    : [];

const convertToClueArray = (
  clues: Record<`${number}/${Direction}`, Clue>
): { down: ClueArrayItem[]; across: ClueArrayItem[] } => {
  const list = parseClues(clues);

  let down: ClueArrayItem[] = [];
  let across: ClueArrayItem[] = [];

  list.forEach((clue) => {
    const { direction } = clue;

    if (direction === 'down') {
      down = [...down, clue];
    }

    if (direction === 'across') {
      across = [...across, clue];
    }
  });

  down = down.sort((a, b) => a.index - b.index);
  across = across.sort((a, b) => a.index - b.index);

  return {
    down,
    across,
  };
};

export default convertToClueArray;
