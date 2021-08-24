interface GridCellProperties {
  isSelected?: boolean;
  isHighlighted?: boolean;
  block?: boolean;
  value?: string;
  rootnum?: number;
  rowNum: number;
  colNum: number;
  isBlockHighlighted?: boolean;
}

export default GridCellProperties;
