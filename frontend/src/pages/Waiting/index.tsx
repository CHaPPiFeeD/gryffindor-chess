import { Button, LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSocketConnection, getGame, leaveQueue } from '../../api/socket';
import { GameDataType } from '../../api/types';
import { useAppDispatch } from '../../hooks/redux';
import { path } from '../../router/constants';
import { setGame } from '../../store/game/gameSlise';
import { QueueList } from './QueueList';
import styles from './styles.module.scss';

export const Waiting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    checkSocketConnection();

    getGame((payload: GameDataType) => {
      dispatch(setGame(payload));
      navigate(path.game());
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
          onClick={() => navigate(path.findGame())}
        >
          Cancel
        </Button>

      </Box>
    </Box>
  );
};
