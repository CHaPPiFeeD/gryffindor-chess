import { Box, Button, Modal, Typography } from '@mui/material';
import { MODAL } from '../../constants/modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setClose } from '../../store/modal/modalSlise';
import styles from './styles.module.scss';

export const EndGameModal = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.modals.endGame);
  const endGameMessage = useAppSelector(state => state.game.endGameMessage);

  const handleClose = () => {
    dispatch(setClose(MODAL.END_GAME));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box className={styles.modal} >
        <Typography variant='h6' component='h1'>
          The game is over! {endGameMessage.title}
        </Typography>
        <Typography>
          {endGameMessage.message}
        </Typography>

        <Box>
          <Button
            onClick={handleClose}
            variant='contained'
            className={styles.button}
          >
            OK
          </Button>
        </Box>

      </Box>
    </Modal>
  );
};
