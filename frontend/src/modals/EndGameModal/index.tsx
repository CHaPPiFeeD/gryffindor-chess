import { Box, Button, Modal, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setClose } from '../../store/modal/modalSlise';
import styles from './styles.module.scss'

export const EndGameModal = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.modals.endGame);
  const endGameMessage = useAppSelector(state => state.game.endGameMessage);

  const handleClose = () => {
    dispatch(setClose('endGame'))
  }

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
            onClick={() => window.location.href = '/'}
            variant='contained'
            className={styles.button}
          >
            Go back
          </Button>
          
          <Button
            onClick={handleClose}
            variant='contained'
            className={styles.button}
          >
            I want to stay
          </Button>
        </Box>

      </Box>
    </Modal>
  )
}
