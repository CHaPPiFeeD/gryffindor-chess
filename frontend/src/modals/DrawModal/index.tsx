import { Box, Button, Modal, Typography } from '@mui/material';
import { offerDraw } from '../../api/socket';
import { MODAL } from '../../constants/modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setClose } from '../../store/modal/modalSlise';
import styles from './styles.module.scss';

export const DrawModal = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.modals.draw);

  const handleYes = () => {
    dispatch(setClose(MODAL.DRAW));
    offerDraw(true);
  };

  const handleNo = () => {
    dispatch(setClose('draw'));
    offerDraw(false);
  };

  return (
    <Modal open={open} >
      <Box className={styles.modal} >

        <Typography component='h6' variant='h6'>
          Opponent offers to surrender. Do you support?
        </Typography>

        <Box className={styles.button_box}>
          <Button
            onClick={handleYes}
            variant='contained'
            className={styles.button}
          >
            Yes
          </Button>

          <Button
            onClick={handleNo}
            variant='contained'
            className={styles.button}
          >
            No, I am a hedgehog
          </Button>
        </Box>

      </Box>
    </Modal>
  );
};
