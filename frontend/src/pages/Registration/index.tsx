import { Typography, TextField, Button, LinearProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import API from '../../api';
import styles from './styles.module.scss';
import * as Yup from 'yup';
import { useQuery } from '../../hooks';
import { showNotification } from '../../store/notification/notificationSlise';
import { useAppDispatch } from '../../hooks/redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { path } from '../../router/constants';

export const Registration = () => {
  const dispatch = useAppDispatch();
  const registrationToken = useQuery('registration_token');
  const [isLoad, setStateLoad] = useState(false);
  const navigate = useNavigate();

  const initialValues: InitialValuesType = {
    username: '',
    password: '',
    registrationToken,
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
    setStateLoad(true);
    await API.registration(values)
      .then((payload) => {
        setStateLoad(false);
        if (payload?.status) {
          dispatch(showNotification('Confirm registration through the letter that will be sent to your mail', 'success'));
        } else {
          dispatch(showNotification(payload.errors[0].message, 'error'));
        }
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

          {isLoad ? <LinearProgress className={styles.progress} /> : null}

          <Button
            variant='contained'
            type='submit'
            className={styles.button_form}
          >
            Registrarion
          </Button>

        </Box>
        
        <Button onClick={() => navigate(path.auth())}>
          Go to login
        </Button>
      </Box>
    </Box>
  );
};

type InitialValuesType = {
  username: string;
  password: string;
  registrationToken: string | null;
};
