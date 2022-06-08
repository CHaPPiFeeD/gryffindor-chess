import { Button, LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers,
  checkSocketConnection,
  startGame,
  leaveQueue,
} from '../../api/socket';
import { gameStartDataType } from '../../api/types';
import { useAppDispatch } from '../../hooks/redux';
import { path } from '../../router/constants';
import { setGameStart, setQueue } from '../../store/game/gameSlise';
import { QueueList } from './QueueList';
import styles from './styles.module.scss';


export const Waiting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    checkSocketConnection();

    startGame((payload: gameStartDataType) => {
      dispatch(setGameStart(payload));
      dispatch(setQueue(null));
      navigate(path.game());
    });

    getUsers((payload: any) => {
      dispatch(setQueue(payload));
    });

    return () => leaveQueue();
  }, []);

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
          onClick={() => navigate(path.auth())}
        >
          Cancel
        </Button>

      </Box>
    </Box>
  );
};
