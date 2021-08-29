import { CellCoverageParams } from '../types/CellCoverage';
import { Clue } from '../types/GridModel';

const updateClue = (
  params: CellCoverageParams,
  newValue: string,
  _clue?: Clue
): Clue => {
  const clue = _clue || {
    clue: '',
    answer: new Array(params.wordLength).fill(''),
  };

  return {
    ...clue,
    answer: clue.answer.map((letter, i) =>
      i === params.position ? newValue : letter
    ),
  };
};

export default updateClue;
