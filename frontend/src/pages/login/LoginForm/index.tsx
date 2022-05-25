import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { regInQueue } from '../../../api/socket'
import { path } from '../../../router/constants'
import { RootState } from '../../../store'
import { setBoard } from '../../../store/board/boardSlise'
import styles from './styles.module.scss'

export const LoginForm = () => {
  const navigate = useNavigate();
  const board = useSelector((state: RootState) => state.board.board)
  const dispatch = useDispatch();

  const initialValues: initialValuesType = {
    username: '',
    color: null,
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is a required field')
      .min(3, 'Must be more than 3 characters'),
    color: Yup.array()
      .required('Color is a required field')
      .nullable(),
  });

  const onSubmit = (values: initialValuesType) => {
    console.log(values.username);
    console.log(values.color);
    regInQueue(values)
      .then((data: any) => {
        dispatch(setBoard(data))
        navigate(path.game())
      })
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
        id='username'
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && !!formik.errors.username}
        helperText={(formik.touched.username && formik.errors.username) || ''}
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
  username: string,
  color: string[] | null,
}
