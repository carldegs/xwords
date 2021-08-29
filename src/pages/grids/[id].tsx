import { Flex, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import ClueBox from '../../components/ClueBox';
import ClueList from '../../components/ClueList';
import Grid from '../../components/Grid';
import GridSizeModal from '../../components/GridSizeModal';
import Layout from '../../components/Layout';
import Toolbox from '../../components/Toolbox';
import useCreateGrid from '../../hooks/useCreateGrid';

const ModifyGridPage: React.FC = () => {
  const router = useRouter();
  const grid = useCreateGrid();
  const sizeModalDisc = useDisclosure();
  const { onOpen } = sizeModalDisc;
  useEffect(() => {
    if (router.query.id === 'new') {
      onOpen();
    }
  }, [router.query.id, onOpen]);

  return (
    <Layout variant="fullContent">
      <GridSizeModal
        onClose={sizeModalDisc.onClose}
        isOpen={sizeModalDisc.isOpen}
        onCreate={(rows, cols) => {
          grid.setRows(rows);
          grid.setCols(cols);
          grid.resetGrid();
        }}
        defaultCols={grid.cols}
        defaultRows={grid.rows}
      />
      <Flex h="full" justifyContent="center" alignItems="center">
        <Flex
          h="fit-content"
          overflow="auto"
          justifyContent="center"
          alignItems="center"
        >
          <Flex flexDir="column" minW="xs" maxW="sm" mr={8}>
            <Toolbox
              flexGrow={0}
              grid={grid}
              sizeModalDisclosure={sizeModalDisc}
              mb={4}
            />
            <ClueList clues={grid.clues} maxH="400px" mt={2} />
          </Flex>

          <Flex flexDir="column" alignItems="center" justifyContent="center">
            <ClueBox grid={grid} mb={4} />
            <Grid
              table={grid.table}
              onCellClick={grid.blockMode ? grid.toggleBlock : grid.selectCell}
              onCellHover={grid.showHoverMode && grid.onHover}
              onCellValueChange={grid.onCellValueChange}
            />
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ModifyGridPage;
