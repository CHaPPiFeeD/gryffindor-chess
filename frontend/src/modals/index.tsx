import { Box } from '@mui/material';
import { ChangeFigureModal } from './ChangeFigureModal';
import { DrawModal } from './DrawModal';
import { EndGameModal } from './EndGameModal';

export const Modals = () => {
  return (
    <Box>
      <EndGameModal />
      <ChangeFigureModal />
      <DrawModal />
    </Box>
  );
};
