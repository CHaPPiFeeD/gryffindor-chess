import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useAppSelector } from '../../../hooks/redux';
import { Pawn } from '../Board/Figure/figures/Pawn';
import styles from './styles.module.scss'

export const InfoSidebar = () => {
  const { moveQueue: moveQueueStore } = useAppSelector(store => store.game)

  return (
    <Box className={styles.content}>
      <Typography component='h5' variant='h5' className={styles.move_queue}>
        Move: {moveQueueStore}
        <Box className={styles.pawn}>
          {moveQueueStore === 'white'
            ? <Pawn fill='white' />
            : <Pawn fill='#333333' />}
        </Box>
      </Typography>

    </Box>
  )
};
