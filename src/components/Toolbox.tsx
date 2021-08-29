import {
  Divider,
  HStack,
  StackProps,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import {
  faBorderAll,
  faExpandAlt,
  faFont,
  faHandPointer,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import { UseCreateGridResponse } from '../hooks/useCreateGrid';
import TooltipButton from './TooltipButton';

interface ToolboxProps extends StackProps {
  grid: UseCreateGridResponse;
  sizeModalDisclosure: UseDisclosureReturn;
}

const Toolbox: React.FC<ToolboxProps> = ({
  grid,
  sizeModalDisclosure,
  ...stackProps
}) => (
  <HStack
    p={1}
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    spacing={4}
    {...stackProps}
    justifyContent="center"
    alignItems="center"
  >
    <HStack spacing={2}>
      <TooltipButton
        label="Add Blocks"
        icon={faStop}
        variant={grid.blockMode ? 'solid' : 'ghost'}
        onClick={() => {
          grid.setBlockMode(true);
        }}
      />
      <TooltipButton
        label="Add Text"
        icon={faFont}
        variant={grid.blockMode ? 'ghost' : 'solid'}
        onClick={() => {
          grid.setBlockMode(false);
        }}
      />
    </HStack>
    <Divider orientation="vertical" />
    <HStack spacing={2}>
      <TooltipButton
        label="Make Symmetric"
        icon={faExpandAlt}
        variant={grid.autoSymmetry ? 'solid' : 'ghost'}
        onClick={() => {
          grid.setAutoSymmetry((mode) => !mode);
        }}
        isDisabled={!grid.blockMode}
      />
      <TooltipButton
        label="Highlight hovered cells"
        icon={faHandPointer}
        variant={grid.showHoverMode ? 'solid' : 'ghost'}
        onClick={() => {
          grid.setHoverMode((mode) => !mode);
        }}
        isDisabled={!grid.blockMode}
      />
    </HStack>
    <Divider orientation="vertical" />
    <TooltipButton
      label="Resize Grid"
      variant="ghost"
      icon={faBorderAll}
      onClick={sizeModalDisclosure.onOpen}
    />
  </HStack>
);

export default Toolbox;
