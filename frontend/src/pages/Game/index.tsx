import { Box } from '@mui/system'
import { FC, useEffect } from 'react'
import { checkEndGame, socketConnection } from '../../api/socket'
import { useAppDispatch } from '../../hooks/redux'
import { setOpen } from '../../store/modal/modalSlise'
import { Board } from './Board'
import styles from './styles.module.scss'

export const Game = () => {
  useEffect(() => socketConnection(), [])
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
