import { Modal, Box, Typography, CircularProgress } from '@mui/material';
import { MODAL } from '../../constants/modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setClose } from '../../store/modal/modalSlise';
import styles from './styles.module.scss';

export const WaitingForOpponentModal = () => {
  const open = useAppSelector(state => state.modals.waitingForOpponent);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setClose(MODAL.WAITING_FOR_OPPONENT));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box className={styles.modal} >
        <Typography component='h5' variant='h5' className={styles.title} >
        The opponent has disconnected. 
        </Typography>

        <Typography >
          If the opponent does not return to the game, 
          you will automatically win. Wait.
        </Typography>

        <CircularProgress  />

      </Box>
    </Modal>
  );
};
