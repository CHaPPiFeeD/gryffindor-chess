import { Box, Typography } from '@mui/material';
import styles from './styles.module.scss';
import { FindGameForm } from './FindGameForm';
import { useEffect } from 'react';
import { exceptionHandler, joinSocket, getGame } from '../../api/socket';
import { useAppDispatch } from '../../hooks/redux';
import { path } from '../../router/constants';
import { useNavigate } from 'react-router-dom';
import { setGame } from '../../store/game/gameSlise';
import { GameDataType } from '../../api/types';

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    joinSocket();
    exceptionHandler(dispatch);
    
    getGame((payload: GameDataType) => {
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
