import { Box } from '@mui/material';
import { ChangePawnModal } from './ChangePawnModal';
import { DrawModal } from './DrawModal';
import { EndGameModal } from './EndGameModal';
import { WaitingForOpponentModal } from './WaitingForOpponentModal';

export const Modals = () => {
  return (
    <Box>
      <EndGameModal />
      <ChangePawnModal />
      <DrawModal />
      <WaitingForOpponentModal />
    </Box>
  );
};
