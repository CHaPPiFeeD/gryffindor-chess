import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getDifferenceTime } from '../../../../helpers'
import { useAppSelector } from '../../../../hooks/redux'

export const TimeTypography = () => {
  const [stateTime, setStateTime] = useState('00:00:00')
  const {
    gameStartTime: gameStartTimeStore,
  } = useAppSelector(store => store.game)

  useEffect(() => {
    setTimeout(() => {
      setStateTime(getDifferenceTime(gameStartTimeStore))
    }, 1000)
  })

  return (
    <Typography
      component='h6'
      variant='h6'
      sx={style.time}
    >
      {stateTime}
    </Typography>
  )
}

const style = {
  time: {
    textAlign: 'center',
  },
}
