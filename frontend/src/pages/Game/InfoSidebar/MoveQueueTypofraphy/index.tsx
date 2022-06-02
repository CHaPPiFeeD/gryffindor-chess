import { Typography, Box } from '@mui/material'
import { Pawn } from '../../../../components/Figure/figures/Pawn'
import { useAppSelector } from '../../../../hooks/redux'
import styles from './styles.module.scss'


export const MoveQueueTypography = () => {
  const { moveQueue: moveQueueStore } = useAppSelector(store => store.game)

  return (
    <Typography component='h5' variant='h5' className={styles.move_queue}>
      {/* Move: {moveQueueStore} */}
      <Box className={styles.pawn}>
        {moveQueueStore === 'white'
          ? <Pawn fill='white' />
          : <Pawn fill='#333333' />}
      </Box>
    </Typography>
  )
}
