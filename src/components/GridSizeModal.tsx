import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface GridSizeModalProps extends Omit<ModalProps, 'children'> {
  onCreate: (rows: number, cols: number) => void;
  defaultRows: number;
  defaultCols: number;
}

// TODO: Implement useForm to handle input validation
const GridSizeModal: React.FC<GridSizeModalProps> = ({
  defaultRows,
  defaultCols,
  onCreate,
  ...props
}) => {
  const [row, setRow] = useState(defaultRows);
  const [col, setCol] = useState(defaultCols);

  return (
    <Modal closeOnEsc={false} closeOnOverlayClick={false} size="xl" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>SET YOUR GRID SIZE</ModalHeader>
        <ModalBody>
          <Stack direction={{ base: 'column', lg: 'row' }}>
            <FormControl id="row">
              <FormLabel>Rows</FormLabel>
              <Input
                type="number"
                onChange={(e) => {
                  setRow(+e.target.value);
                }}
                value={row}
              />
            </FormControl>

            <FormControl id="col">
              <FormLabel>Columns</FormLabel>
              <Input
                type="number"
                onChange={(e) => {
                  setCol(+e.target.value);
                }}
                value={col}
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onCreate(row, col);
              props.onClose();
            }}
          >
            Create Grid
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GridSizeModal;
