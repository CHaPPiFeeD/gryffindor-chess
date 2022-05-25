import { Box } from '@mui/system'
import { FC } from 'react'
import { Board } from './Board'
import styles from './styles.module.scss'

export const Game = () => {

  return (
    <Box className={styles.wrapper}>
      <Board />
    </Box>
  )
}
