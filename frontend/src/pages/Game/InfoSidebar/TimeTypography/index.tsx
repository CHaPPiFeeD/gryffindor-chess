import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getDifferenceTime } from '../../../../helpers';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss';


export const TimeTypography = () => {
  const [stateTime, setStateTime] = useState('00:00');
  const {
    gameStartTime: gameStartTimeStore,
    gameEndTime: gameEndTimeStore,
  } = useAppSelector(store => store.game);

  useEffect(() => {
    setTimeout(() => {
      setStateTime(getDifferenceTime(gameStartTimeStore, gameEndTimeStore));
    }, 1000);
  });

  return (
    <Typography
      component='h6'
      variant='h6'
      className={styles.time}
    >
      {stateTime}
    </Typography>
  );
};

