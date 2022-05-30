import { Box, Modal, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setClose } from '../../store/modal/modalSlise';
import styles from './styles.module.scss'

export const EndGameModal = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.modals.endGame);

  const handleClose = () => {
    dispatch(setClose('endGame'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box className={styles.modal} >
        <Typography variant='h6' component='h2'>
          The game is over!
        </Typography>
      </Box>
    </Modal>
  )
}
