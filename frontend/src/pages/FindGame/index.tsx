import { Box, Typography } from '@mui/material';
import styles from './styles.module.scss';
import { FindGameForm } from './FindGameForm';
import { useEffect } from 'react';
import { 
  exceptionHandler, 
  getUsers, 
  joinSocket, 
  getGame, 
} from '../../api/socket';
import { useAppDispatch } from '../../hooks/redux';
import { path } from '../../router/constants';
import { useNavigate } from 'react-router-dom';
import { setGame, setQueue } from '../../store/game/gameSlise';
import { gameDataType, usersQueueType } from '../../api/types';

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    joinSocket();
    exceptionHandler(dispatch);
    getGame((payload: gameDataType) => {
      dispatch(setGame(payload));
      navigate(path.game());
    });
  }, []);

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.content}>

        <Typography
          component='h2'
          variant='h4'
          sx={{ marginBottom: '10px' }}
        >
          Chess
        </Typography>

        <FindGameForm />

      </Box>
    </Box>
  );
};
