import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { regInQueue } from '../../../api/socket'
import { useAppDispatch } from '../../../hooks/redux'
import { path } from '../../../router/constants'
import { setQueue } from '../../../store/game/gameSlise'
import styles from './styles.module.scss'

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues: initialValuesType = {
    name: '',
    color: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Username is a required field')
      .min(3, 'Must be more than 3 characters')
      .max(24, 'No more than 24 characters'),
    color: Yup.array()
      .required('Color is a required field')
      .nullable(),
  });

  const onSubmit = (values: initialValuesType) => {
    regInQueue(values, (queue: any) => {
      dispatch(setQueue(queue));
    })
    navigate(path.waiting());
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

      <TextField
        label='Name'
        id='name'
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && !!formik.errors.name}
        helperText={(formik.touched.name && formik.errors.name) || ''}
        style={{ background: '#f0f0f0', borderRadius: '5px' }}
      />

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
  )
}

const colorOptions = [
  { label: 'white', color: ['white'] },
  { label: 'black', color: ['black'] },
  { label: 'any', color: ['white', 'black'] },
]

type initialValuesType = {
  name: string,
  color: string[] | null,
}
