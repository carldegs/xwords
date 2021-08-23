import { FlexProps, Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import GridCellProperties from '../types/GridCellProperties';

interface GridCellProps extends Omit<FlexProps, 'onClick'>, GridCellProperties {
  onClick?: (cell: GridCellProperties) => void;
  onHover?: (cell: GridCellProperties) => void;
  size?: 'sm' | 'md' | 'lg';
}

// TODO: Set parameters for sm and lg
const gridCellSize = {
  sm: {
    w: '24px',
    h: '24px',
    rootnumSize: '12px',
    valueSize: '16px',
  },
  md: {
    w: '42px',
    h: '42px',
    rootnumSize: '12px',
    valueSize: '24px',
  },
  lg: {
    w: '24px',
    h: '24px',
    rootnumSize: '12px',
    valueSize: '16px',
  },
};

const GridCell: React.FC<GridCellProps> = ({
  isSelected,
  isHighlighted,
  block,
  rootnum,
  value,
  rowNum,
  colNum,
  onClick,
  size = 'md',
  isBlockHighlighted,
  onHover,
  ...props
}) => {
  let bg = 'transparent';
  const sizeStyle = gridCellSize[size];

  if (isHighlighted) {
    bg = 'blue.50';
  }

  if (isSelected) {
    bg = 'blue.300';
  }
  if (isBlockHighlighted) {
    bg = 'gray.300';
  }

  if (block) {
    bg = 'gray.800';
  }

  const cellProperties: GridCellProperties = useMemo(
    () => ({
      isSelected,
      isHighlighted,
      block,
      rootnum,
      value,
      rowNum,
      colNum,
      isBlockHighlighted,
    }),
    [
      isSelected,
      isHighlighted,
      block,
      rootnum,
      value,
      rowNum,
      colNum,
      isBlockHighlighted,
    ]
  );

  return (
    <Flex
      bg={bg}
      border="0.5px solid var(--chakra-colors-gray-700)"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(cellProperties);
        }
      }}
      onMouseEnter={() => {
        if (onHover) {
          onHover(cellProperties);
        }
      }}
      onMouseLeave={() => {
        if (onHover) {
          onHover(undefined);
        }
      }}
      w={sizeStyle.w}
      h={sizeStyle.h}
      textAlign="center"
      pos="relative"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Text pos="absolute" fontSize={sizeStyle.rootnumSize} top="2%" left="5%">
        {rootnum}
      </Text>
      <Text fontSize={sizeStyle.valueSize} fontWeight="bold" mt={2}>
        {value}
      </Text>
    </Flex>
  );
};

export default GridCell;
