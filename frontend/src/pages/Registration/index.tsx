import { Typography, TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import API from '../../api';
import { path } from '../../router/constants';
import styles from './styles.module.scss';
import * as Yup from 'yup';

export const Registration = () => {
  const initialValues: InitialValuesType = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Name is a required field')
      .min(3, 'Name is too short'),
    password: Yup.string()
      .required('Password is a required field')
      .min(8, 'Password is too short'),
  });

  const onSubmit = async (values: InitialValuesType) => {
    const data = await API.registration(values)
      .then((payload) => {
        console.log(payload);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  
  return (
    <Box className={styles.wrapper}>
      <Box className={styles.content}>

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
            id='username'
            label='Name'
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && !!formik.errors.username}
            helperText={(formik.touched.username && formik.errors.username) || ''}
            variant='outlined'
            className={styles.text_field}
          />

          <TextField
            id='password'
            label='Password'
            type='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && !!formik.errors.password}
            helperText={(formik.touched.password && formik.errors.password) || ''}
            variant='outlined'
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
      </Box>
    </Box>
  );
};

type InitialValuesType = {
  username: string;
  password: string;
};
