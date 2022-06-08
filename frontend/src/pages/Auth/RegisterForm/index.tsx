import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import styles from './styles.module.scss';

export const RegisterForm = (props: { setForm: Function }) => {
  const initialValues: InitialValuesType = {
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Name is a required field')
      .min(3, 'Name is too short'),
    email: Yup.string()
      .required('Email is a required field')
      .email('Invalid email'),
    password: Yup.string()
      .required('Password is a required field')
      .min(8, 'Password is too short'),
  });

  const onSubmit = async (values: InitialValuesType) => {
    const data = await API.registration(values);
    console.log(data);
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
        Registration
      </Typography>

      <Box
        className={styles.form}
        component='form'
        onSubmit={formik.handleSubmit}
      >

        <TextField
          id="username"
          label="Name"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && !!formik.errors.username}
          helperText={(formik.touched.username && formik.errors.username) || ''}
          variant="outlined"
          className={styles.text_field}
        />

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
          Registrarion
        </Button>

      </Box>

      <Button
        className={styles.button}
        onClick={() => props.setForm(true)}
      >
        Login
      </Button>
    </Box>
  );
};

type InitialValuesType = {
  username: string;
  email: string;
  password: string;
}
