import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { regInQueue, getGame } from '../../../api/socket';
import { useAppDispatch } from '../../../hooks/redux';
import { path } from '../../../router/constants';
import styles from './styles.module.scss';

export const FindGameForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues: initialValuesType = {
    color: null,
  };

  const validationSchema = Yup.object({
    color: Yup.array()
      .required('Color is a required field')
      .nullable(),
  });

  const onSubmit = (values: initialValuesType) => {
    regInQueue(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Box
      className={styles.form}
      component='form'
      onSubmit={formik.handleSubmit}
    >

      <Autocomplete
        sx={{ margin: '10px 0 15px' }}
        includeInputInList
        id='color'
        options={colorOptions}
        getOptionLabel={(option: any) => option.label}
        onChange={(e, v) => formik.setFieldValue('color', v?.color || '')}
        renderInput={(params) =>
          <TextField
            {...params}
            label='Color'
            error={formik.touched.color && !!formik.errors.color}
            helperText={(formik.touched.color && formik.errors.color) || ''}
            style={{ background: '#f0f0f0', borderRadius: '5px' }}
          />
        }
      />

      <Button variant='contained' type='submit'>
        Start
      </Button>

    </Box>
  );
};

const colorOptions = [
  { label: 'white', color: ['white'] },
  { label: 'black', color: ['black'] },
  { label: 'any', color: ['white', 'black'] },
];

type initialValuesType = {
  color: string[] | null,
}
