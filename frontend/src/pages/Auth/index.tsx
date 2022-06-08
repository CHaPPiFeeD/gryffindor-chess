import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import styles from './styles.module.scss';

export const Auth = () => {
  const [stateLoginForm, setStateLoginForm] = useState(true);

  const changeForm = (value: boolean) => {
    setStateLoginForm(value);
  };

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
