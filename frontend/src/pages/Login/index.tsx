import { Box, Typography } from '@mui/material';
import styles from './styles.module.scss';
import { LoginForm } from './LoginForm';

export const Login = () => {

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

        <LoginForm />

      </Box>
    </Box>
  )
}

export default Login
