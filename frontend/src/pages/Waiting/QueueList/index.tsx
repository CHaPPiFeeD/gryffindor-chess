import { Box, Typography } from '@mui/material'
import { Pawn } from '../../../components/Figure/figures/Pawn'
import { useAppSelector } from '../../../hooks/redux';
import styles from './styles.module.scss'


export const QueueList = () => {
  const queue = useAppSelector(store => store.game.queue);

  return (
    <Box className={styles.list}>

      {queue?.map((value, index) => {

        return (
          <Box key={index} className={styles.item}>
            <Typography className={styles.name}>
              {value.name}
            </Typography>
            <Box className={styles.figure_box}>

              {value.color.map((v) => {

                if (v === 'white') return <Box className={styles.figure} key='0'><Pawn fill='white' /></Box>
                if (v === 'black') return <Box className={styles.figure} key='1'><Pawn fill='#333333' /></Box>
              })}

            </Box>
          </Box>
        )
      })}

    </Box>
  )
}
