import { Flex, Heading, Stack, StackProps, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { Clue } from '../types/GridModel';
import convertToClueArray, { ClueArrayItem } from '../utils/convertToClueArray';

interface ClueListProps extends StackProps {
  clues: Record<string, Clue>;
}

const ClueText: React.FC<{ clue: ClueArrayItem }> = ({ clue }) => (
  <Flex>
    <Heading size="sm" mr={2} mt="1.5px">
      {clue.index}
    </Heading>
    <Stack>
      {clue.clue ? (
        <Text mb={0}>{`${clue.clue}`}</Text>
      ) : (
        <Text color="gray.600" fontStyle="italic" mb={0}>
          No Clue
        </Text>
      )}
      <Text fontWeight="bold" mt={'1px !important'}>
        {clue.answer.map((a) => (a ? a : ' _')).join('')}
      </Text>
    </Stack>
  </Flex>
);

// TODO: Highlight selected word
const ClueList: React.FC<ClueListProps> = ({ clues, ...stackProps }) => {
  const list = useMemo(() => convertToClueArray(clues), [clues]);

  return (
    <Stack
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      overflow="auto"
      spacing={3}
      {...stackProps}
    >
      {list.across.length && <Heading fontSize="sm">ACROSS</Heading>}
      {list.across.map((clue) => (
        <ClueText key={`${clue.index}D`} clue={clue} />
      ))}

      {list.down.length && (
        <Heading fontSize="sm" pt={4}>
          DOWN
        </Heading>
      )}
      {list.down.map((clue) => (
        <ClueText key={`${clue.index}D`} clue={clue} />
      ))}
    </Stack>
  );
};

export default ClueList;
