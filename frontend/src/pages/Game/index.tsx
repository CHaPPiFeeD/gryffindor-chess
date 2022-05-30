import { Box } from '@mui/system'
import { FC, useEffect } from 'react'
import { checkEndGame } from '../../api/socket'
import { useAppDispatch } from '../../hooks/redux'
import { setOpen } from '../../store/modal/modalSlise'
import { Board } from './Board'
import styles from './styles.module.scss'

export const Game = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    checkEndGame((data: any) => {
      dispatch(setOpen('endGame'))
      console.log(data);
    })
  }, [])

  return (
    <Box className={styles.wrapper}>
      <Board />
    </Box>
  )
}
