import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import GridCellProperties from '../types/GridCellProperties';
import GridCell, { GridCellProps } from './GridCell';

interface GridProps {
  table?: GridCellProperties[][];
  onCellClick?: GridCellProps['onClick'];
  onCellHover?: GridCellProps['onHover'];
  onCellValueChange?: GridCellProps['onCellValueChange'];
}

const Grid: React.FC<GridProps> = ({
  table,
  onCellClick,
  onCellHover,
  onCellValueChange,
}) => {
  return (
    <Box w="fit-content" bg="gray.900" p={1} borderRadius={4}>
      {table?.map((row) => (
        <Flex flexDir="row" key={`row-${row[0].rowNum}`}>
          {row?.map((cell) => (
            <GridCell
              key={`(${cell.rowNum}, ${cell.colNum})`}
              onClick={onCellClick}
              onHover={onCellHover}
              onCellValueChange={onCellValueChange}
              cursor="pointer"
              {...cell}
            />
          ))}
        </Flex>
      ))}
    </Box>
  );
};

export default Grid;
