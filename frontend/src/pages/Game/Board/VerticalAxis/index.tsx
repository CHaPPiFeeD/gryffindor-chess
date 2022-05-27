import { Box } from '@mui/material';
import styles from './styles.module.scss'


export const VerticalAxis = (props: any) => {
  return (
    <Box className={styles.axis}>
      {verticalAxis.map((v, i) => (
        <Box {...props} className={styles.cell} key={i}>{v}</Box>
      ))}
    </Box>
  )
}

const verticalAxis = ['8', '7', '6', '5', '4', '3', '2', '1'];
