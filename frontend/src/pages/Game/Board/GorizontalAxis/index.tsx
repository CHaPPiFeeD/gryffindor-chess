import { Box, colors } from '@mui/material';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss'


export const GorizontallAxis = (props: any) => {
  const { color: colorStore } = useAppSelector(store => store.game)

  const isReverse = colorStore === 'black';

  const axis = isReverse ? gorizontalAxisReverse : gorizontalAxis;

  return (
    <Box className={styles.axis}>
      {axis.map((v, i) => (
        <Box {...props} className={styles.cell} key={i}>{v}</Box>
      ))}
    </Box>
  )
}

const gorizontalAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const gorizontalAxisReverse = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

