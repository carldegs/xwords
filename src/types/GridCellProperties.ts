import CellCoverage from './CellCoverage';

interface GridCellProperties {
  isSelected?: boolean;
  isHighlighted?: boolean;
  block?: boolean;
  value?: string;
  rootnum?: number;
  rowNum: number;
  colNum: number;
  isBlockHighlighted?: boolean;
  isWordHighlighted?: boolean;
  isRootnumHighlighted?: boolean;
  coverage?: CellCoverage;
}

export default GridCellProperties;
