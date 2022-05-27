import { Box } from '@mui/material';
import styles from './styles.module.scss'


export const GorizontallAxis = (props: any) => {
  return (
    <Box className={styles.axis}>
      {gorizontalAxis.map((v, i) => (
        <Box {...props} className={styles.cell} key={i}>{v}</Box>
      ))}
    </Box>
  )
}

const gorizontalAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

