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
  const colorState = useSelector((state: RootState) => state.board.color)

  const start = new Date()

  boardState.forEach((v, i) => {
    v.forEach((v, j) => {
      let row = i;
      let col = j;
      const number = i + j;

      if (colorState === 'black') {
        row = Math.abs(row - 7);
        col = Math.abs(col - 7);
      }

      const figure = (
        <Box
          className={number % 2 === 0 ? styles.cell_white : styles.cell_black}
          key={`${row}${col}`}
          id={`${row}${col}`}
          data-row={row}
          data-col={col}
        >
          <Figure row={row} col={col} />
        </Box>
      )

      board.push(figure)
    })
  })

  const end = new Date()

  console.log(+end - +start);


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

