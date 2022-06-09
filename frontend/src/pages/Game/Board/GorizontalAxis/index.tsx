import { Box } from '@mui/material';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss';


export const GorizontallAxis = (props: { reverse?: boolean }) => {
  const { color: colorStore } = useAppSelector(store => store.game);
  const axis = colorStore === 'black' ? gorizontalAxisReverse : gorizontalAxis;
  const style = props.reverse 
    ? [styles.cell, styles.rotate].join(' ') 
    : styles.cell;

  return (
    <Box className={styles.axis}>
      {axis.map((v, i) => (
        <Box className={style} key={i}>{v}</Box>
      ))}
    </Box>
  );
};

const gorizontalAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const gorizontalAxisReverse = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

