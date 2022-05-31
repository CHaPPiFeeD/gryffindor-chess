import { Box } from '@mui/material';
import { ChangeFigureModal } from './ChangeFigureModal';
import { EndGameModal } from './EndGameModal';

export const Modals = () => {
  return (
    <Box>
      <EndGameModal />
      <ChangeFigureModal />
    </Box>
  )
};
