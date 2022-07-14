import { Alert, Box, Button, LinearProgress, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import API from '../../../api';
import { useAppDispatch } from '../../../hooks/redux';
import { showNotification } from '../../../store/notification/notificationSlise';
import styles from './styles.module.scss';

export const RegisterForm = (props: { setForm: Function }) => {
  const [isLoad, setStateLoad] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues: InitialValuesType = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is a required field')
      .email('Invalid email'),
  });

  const onSubmit = async (values: InitialValuesType) => {
    setStateLoad(true);
    await API.createUser(values)
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
          id='email'
          label='Email'
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && !!formik.errors.email}
          helperText={(formik.touched.email && formik.errors.email) || ''}
          variant='outlined'
          className={styles.text_field}
        />

        {isLoad ? <LinearProgress className={styles.progress} /> : null}

        <Button
          variant='contained'
          type='submit'
          className={styles.button_form}
        >
          Registration
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
  email: string;
}
