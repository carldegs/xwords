import { HStack, Input } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { createRef } from 'react';

interface AnswerInputProps {
  onChange: (answer: string[]) => void;
  value?: string[];
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onChange, value }) => {
  const elRefs = useRef([]);

  useEffect(() => {
    if (elRefs.current.length !== value?.length) {
      elRefs.current = Array.from(new Array(value?.length)).map(
        (_, i) => elRefs.current[i] || createRef()
      );
    }
  }, [value]);

  return (
    <HStack>
      {value?.length &&
        value
          .map((letter, i) => ({ letter, i }))
          .map(({ letter, i }) => (
            <Input
              key={i}
              value={letter}
              onChange={(e) => {
                let newValue = e.target.value;

                if (!Number.isNaN(+newValue)) {
                  return;
                }

                if (newValue.length > 1) {
                  newValue = newValue.replace(value[i], '');
                }

                newValue = newValue.toUpperCase();
                onChange(value.map((v, j) => (i === j ? newValue : v)));
                elRefs.current[i + (!newValue ? -1 : 1)]?.current.focus();
              }}
              w="40px"
              minW="25px"
              h="40px"
              p={0}
              textAlign="center"
              ref={elRefs.current[i]}
            />
          ))}
    </HStack>
  );
};

export default AnswerInput;
