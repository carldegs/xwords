import { FlexProps, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useMemo } from 'react';

import GridCellProperties from '../types/GridCellProperties';

export interface GridCellProps
  extends Omit<FlexProps, 'onClick'>,
    GridCellProperties {
  onClick?: (cell: GridCellProperties) => void;
  onHover?: (cell: GridCellProperties) => void;
  onCellValueChange: (cell: GridCellProperties, value: string) => void;
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
  isWordHighlighted,
  coverage,
  isRootnumHighlighted,
  onHover,
  onCellValueChange,
  ...props
}) => {
  let bg = 'white';
  const sizeStyle = gridCellSize[size];
  const textInput = useRef(null);

  useEffect(() => {
    if (isSelected) {
      textInput.current?.focus();
    } else {
      textInput.current?.blur();
    }
  }, [isSelected, rowNum, colNum]);

  if (isHighlighted) {
    bg = 'blue.200';
  }

  if (isWordHighlighted) {
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
      isWordHighlighted,
      isRootnumHighlighted,
      coverage,
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
      isWordHighlighted,
      isRootnumHighlighted,
      coverage,
    ]
  );

  return (
    <Flex
      bg={bg}
      m="0.5px"
      borderRadius="1.5px"
      // border="0.5px solid var(--chakra-colors-gray-700)"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(cellProperties);
        }
        // textInput.current.focus();
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
      <input
        onChange={(e) => {
          const letter = e.target.value[e.target.value.length - 1];

          if (onCellValueChange) {
            onCellValueChange(cellProperties, letter);
          }
        }}
        value={value || ''}
        style={{
          opacity: 0,
          height: '100%',
          width: '100%',
          position: 'absolute',
          cursor: 'pointer',
          // display: 'none',
        }}
        ref={textInput}
      />
      <Text
        pos="absolute"
        fontSize={sizeStyle.rootnumSize}
        top="2%"
        left="5%"
        fontWeight={isRootnumHighlighted && 'bold'}
      >
        {rootnum}
      </Text>
      <Text fontSize={sizeStyle.valueSize} fontWeight="bold" mt={2}>
        {value}
      </Text>
    </Flex>
  );
};

export default GridCell;
