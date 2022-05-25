import { Box } from '@mui/system'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Figure } from './components/Figure';
import { GorizontallAxis } from './components/GorizontalAxis';
import { VerticalAxis } from './components/VerticalAxis';
import styles from './styles.module.scss';

export const Board = () => {
  const board: any[] = [];
  const boardState = useSelector((state: RootState) => state.board.board)

  verticalAxis.forEach((v, i) => {
    gorizontalAxis.forEach((v, j) => {
      const number = i + j;

      board.push(
        <Box
          className={number % 2 === 0 ? styles.cell_white : styles.cell_black}
          key={`${i}${j}`}
          id={`${i}${j}`}
          data-row={i}
          data-col={j}
        >
          <Figure row={i} col={j} />
        </Box>,
      )
    })
  })

  return (
    <Box className={styles.wrapper}>
      <GorizontallAxis style={{ transform: 'rotate(-180deg)' }} />

      <Box className={styles.vericalAxisBox}>
        <VerticalAxis />

        <Box className={styles.board}>
          {board}
        </Box>

        <VerticalAxis style={{ transform: 'rotate(-180deg)' }} />
      </Box>

      <GorizontallAxis />
    </Box>
  )
}

const verticalAxis = ['8', '7', '6', '5', '4', '3', '2', '1'];
const gorizontalAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

