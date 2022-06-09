import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import API from '../../../api';
import { path } from '../../../router/constants';
import styles from './styles.module.scss';

export const LoginForm = (props: { setForm: Function }) => {
  const navigate = useNavigate();

  const initialValues: InitialValuesType = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is a required field')
      .email('Invalid email'),
    password: Yup.string()
      .required('Password is a required field')
      .min(8, 'Password is too short'),
  });

  const onSubmit = async (values: InitialValuesType) => {
    await API.login(values)
      .then((payload) => {
        console.log(payload);
        localStorage.setItem('access_token', payload.data.token);
        navigate(path.findGame());
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Box className={styles.wrapper}>

      <Typography
        component='h6'
        variant='h6'
        className={styles.title}
      >
        Log in
      </Typography>

      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        className={styles.form}
      >

        <TextField
          id="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && !!formik.errors.email}
          helperText={(formik.touched.email && formik.errors.email) || ''}
          variant="outlined"
          className={styles.text_field}
        />

        <TextField
          id="password"
          label="Password"
          type='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && !!formik.errors.password}
          helperText={(formik.touched.password && formik.errors.password) || ''}
          variant="outlined"
          className={styles.text_field}
        />

        <Button
          variant='contained'
          type='submit'
          className={styles.button_form}
        >
          Login
        </Button>

      </Box>

      <Button
        className={styles.button}
        onClick={() => props.setForm(false)}
      >
        Registration
      </Button>

    </Box>

  );
};

type InitialValuesType = {
  email: string;
  password: string
}
