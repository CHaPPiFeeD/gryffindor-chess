import { Box } from '@mui/material';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss'


export const VerticalAxis = (props: any) => {
  const { color: colorStore } = useAppSelector(store => store.game)

  const isReverse = colorStore === 'black';

  const axis = isReverse ? verticalAxisReverse : verticalAxis;

  return (
    <Box className={styles.axis}>
      {axis.map((v, i) => (
        <Box {...props} className={styles.cell} key={i}>{v}</Box>
      ))}
    </Box>
  )
}

const verticalAxis = ['8', '7', '6', '5', '4', '3', '2', '1'];
const verticalAxisReverse = ['1', '2', '3', '4', '5', '6', '7', '8'];
