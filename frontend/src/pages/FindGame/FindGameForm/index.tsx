import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { regInQueue } from '../../../api/socket';
import { path } from '../../../router/constants';
import styles from './styles.module.scss';

export const FindGameForm = () => {
  const navigate = useNavigate();

  const initialValues: initialValuesType = {
    color: null,
    mode: null,
  };

  const validationSchema = Yup.object({
    color: Yup.array()
      .required('Color is a required field')
      .nullable(),
    mode: Yup.string()
      .required('Mode is a required field'),
  });

  const onSubmit = (values: initialValuesType) => {
    regInQueue(values, ({ isFind }: { isFind: boolean }) => {
      if (isFind) navigate(path.game());
      if (!isFind) navigate(path.waiting());
    });
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

      <Autocomplete
        sx={{ marginBottom: '15px' }}
        includeInputInList
        id='mode'
        options={modeOptions}
        getOptionLabel={(option: any) => option.label}
        onChange={(e, v) => formik.setFieldValue('mode', v?.mode || '')}
        renderInput={(params) =>
          <TextField
            {...params}
            label='mode'
            error={formik.touched.mode && !!formik.errors.mode}
            helperText={(formik.touched.mode && formik.errors.mode) || ''}
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
  { label: 'White', color: ['white'] },
  { label: 'Black', color: ['black'] },
  { label: 'Any', color: ['white', 'black'] },
];

const modeOptions = [
  { label: 'Standart', mode: 'STANDART' },
  { label: 'Fog', mode: 'FOG' },
];

type initialValuesType = {
  color: string[] | null,
  mode: string[] | null,
}
