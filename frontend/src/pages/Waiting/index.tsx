import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUsers, socketConnection, startGame } from '../../api/socket'
import { gameDataType, usersQueueType } from '../../api/types'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { path } from '../../router/constants'
import { setBoard, setQueue } from '../../store/game/gameSlise'
import styles from './styles.module.scss'

export const Waiting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queue = useAppSelector(store => store.game.queue);

  useEffect(() => socketConnection(), [])

  useEffect(() => {
    startGame((payload: gameDataType) => {
      dispatch(setBoard(payload))
      dispatch(setQueue(null));
      navigate(path.game())
    })

    getUsers((payload: any) => {
      console.log(payload);
      dispatch(setQueue(payload));
    })
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

        <Box>
          {queue?.map((value, index) => {
            return (
              <Box key={index}>
                {value.username} | {value.color.join(', ')}
              </Box>
            )
          })}
        </Box>

      </Box>
    </Box>
  )
}
