import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { path } from '../../router/constants';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import styles from './styles.module.scss';

export const Auth = () => {
  const [stateLoginForm, setStateLoginForm] = useState(true);
  const navigate = useNavigate();

  const changeForm = (value: boolean) => {
    setStateLoginForm(value);
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) navigate(path.findGame());
  }, []);

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.content}>

        <Typography
          component='h2'
          variant='h4'
          sx={{ marginBottom: '5px' }}
        >
          Chess
        </Typography>

        {stateLoginForm
          ? <LoginForm setForm={changeForm} />
          : <RegisterForm setForm={changeForm} />}

      </Box>
    </Box>
  );
};
