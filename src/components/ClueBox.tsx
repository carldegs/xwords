import {
  Flex,
  FlexProps,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

import { UseCreateGridResponse } from '../hooks/useCreateGrid';
import Direction from '../types/Direction';
import { parseClues } from '../utils/convertToClueArray';
import AnswerInput from './AnswerInput';
import { AutoResizeTextarea } from './AutoresizeTextarea';

const ClueBox: React.FC<{ grid: UseCreateGridResponse } & FlexProps> = ({
  grid,
  ...props
}) => {
  const {
    index,
    direction = '',
    answer,
    clue,
  } = parseClues(grid.selectedClue)[0] || {};

  return (
    <Flex
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      overflow="auto"
      spacing={2}
      minH="138px"
      {...props}
    >
      {index && direction ? (
        <Stack>
          <HStack alignItems="flex-start">
            <Heading fontSize="md" mt="10px">{`${index || ''}${
              direction[0]?.toUpperCase() || ''
            }`}</Heading>
            {/* <Text>{clue}</Text> */}
            <AutoResizeTextarea
              value={clue}
              onChange={(e) => {
                grid.onClueTextChange(
                  e.target.value,
                  index,
                  direction as Direction
                );
              }}
            />
          </HStack>
          <AnswerInput
            onChange={(value) => {
              grid.onClueAnswerChange(value, index, direction as Direction);
            }}
            value={answer}
          />
        </Stack>
      ) : (
        <Flex alignItems="center" justifyContent="center" h="full" w="full">
          <Text fontStyle="italic">Select a cell below.</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ClueBox;
