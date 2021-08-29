export interface CellCoverageParams {
  rootnum: number;
  position: number;
  wordLength: number;
}

interface CellCoverage {
  down?: CellCoverageParams;
  across?: CellCoverageParams;
}

export default CellCoverage;
