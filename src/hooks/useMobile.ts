import { useBreakpointValue } from '@chakra-ui/react';

const useMobile = (breakpoint = 'lg'): boolean => {
  return useBreakpointValue({ base: true, [breakpoint]: false });
};

export default useMobile;
