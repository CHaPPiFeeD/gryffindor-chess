import { Button, LinearProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUsers, checkSocketConnection, startGame, leaveQueue } from '../../api/socket'
import { gameDataType, usersQueueType } from '../../api/types'
import { Pawn } from '../../components/Figure/figures/Pawn'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { path } from '../../router/constants'
import { setBoard, setQueue } from '../../store/game/gameSlise'
import { QueueList } from './QueueList'
import styles from './styles.module.scss'

export const Waiting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queue = useAppSelector(store => store.game.queue);

  useEffect(() => {
    checkSocketConnection();

    startGame((payload: gameDataType) => {
      dispatch(setBoard(payload))
      dispatch(setQueue(null));
      navigate(path.game())
    })

    getUsers((payload: any) => {
      dispatch(setQueue(payload));
    })

    return () => {
      leaveQueue();
    }
  }, [])

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.content}>

        <Typography
          component='h4'
          variant='h4'
          sx={{ marginBottom: '10px' }}
        >
          Queue
        </Typography>

        <QueueList />

        <LinearProgress className={styles.progress} />

        <Button
          variant='contained'
          type='submit'
          className={styles.button}
          onClick={() => navigate(path.login())}
        >
          Cancel
        </Button>

      </Box>
    </Box>
  )
}
