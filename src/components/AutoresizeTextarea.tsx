import { Textarea, TextareaProps } from '@chakra-ui/react';
import React from 'react';
import ResizeTextarea from 'react-textarea-autosize';

// eslint-disable-next-line react/display-name
export const AutoResizeTextarea = React.forwardRef<undefined, TextareaProps>(
  (props, ref) => {
    return (
      <Textarea
        minH="unset"
        overflow="hidden"
        w="100%"
        resize="none"
        ref={ref as any}
        minRows={1}
        as={ResizeTextarea}
        {...props}
      />
    );
  }
);
