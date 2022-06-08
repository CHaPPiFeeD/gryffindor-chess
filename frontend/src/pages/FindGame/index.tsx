import { Box, Typography } from '@mui/material';
import styles from './styles.module.scss';
import { FindGameForm } from './FindGameForm';
import { useEffect } from 'react';
import { exceptionHandler, joinSocket } from '../../api/socket';
import { showNotification } from '../../store/notification/notificationSlise';
import { useAppDispatch } from '../../hooks/redux';

export const FindGame = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    joinSocket();
    exceptionHandler(dispatch);
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
