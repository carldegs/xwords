import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Grid from '../../components/Grid';
import GridSizeModal from '../../components/GridSizeModal';
import Layout from '../../components/Layout';
import useCreateGrid from '../../hooks/useCreateGrid';

const ModifyGridPage: React.FC = () => {
  const router = useRouter();
  const grid = useCreateGrid();
  const {
    onOpen: onSizeModalOpen,
    onClose: onSizeModalClose,
    isOpen: isSizeModalOpen,
  } = useDisclosure();

  useEffect(() => {
    if (router.query.id === 'new') {
      onSizeModalOpen();
    }
  }, [router.query.id, onSizeModalOpen]);

  return (
    <Layout variant="fullContent">
      <GridSizeModal
        onClose={onSizeModalClose}
        isOpen={isSizeModalOpen}
        onCreate={(rows, cols) => {
          grid.setRows(rows);
          grid.setCols(cols);
        }}
        defaultCols={grid.cols}
        defaultRows={grid.rows}
      />
      <Flex
        h="full"
        overflow="auto"
        justifyContent="center"
        alignItems="center"
      >
        <Box pr={12} minW="250px">
          <Heading fontSize="xl" mb={4}>
            TOOLS
          </Heading>
          <Button
            leftIcon={
              grid.blockMode ? (
                <Box w="12px" h="12px" bg="gray.800" />
              ) : (
                <EditIcon />
              )
            }
            onClick={() => {
              grid.setBlockMode((mode) => !mode);
            }}
            isFullWidth
          >
            {grid.blockMode ? 'Block' : 'Text'}
          </Button>
          {grid.blockMode && (
            <Stack>
              <Checkbox
                onChange={(e) => {
                  grid.setAutoSymmetry(e.target.checked);
                }}
                defaultChecked={grid.autoSymmetry}
                mt={2}
              >
                Symmetry
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  grid.setHoverMode(e.target.checked);
                }}
                defaultChecked={grid.showHoverMode}
                mt={2}
              >
                Highlight cells on hover
              </Checkbox>
            </Stack>
          )}
        </Box>
        <Grid
          table={grid.table}
          onCellClick={grid.blockMode ? grid.toggleBlock : grid.selectCell}
          onCellHover={grid.showHoverMode && grid.onHover}
        />
      </Flex>
    </Layout>
  );
};

export default ModifyGridPage;
