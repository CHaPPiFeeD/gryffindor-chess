import { Box } from '@mui/system'
import styles from './styles.module.scss'

export const Board = () => {
  const board = [];

  for (let i = vericalAxis.length - 1; i >= 0; i--) {
    for (let j = 0; j < gorizontalAxis.length; j++) {
      const number = i + j + 2;

      if (number % 2 === 0) {
        board.push(
          <Box className={styles.cell_white}>{vericalAxis[i]}{gorizontalAxis[j]}</Box>,
        )
      } else {
        board.push(
          <Box className={styles.cell_black}>{vericalAxis[i]}{gorizontalAxis[j]}</Box>,
        )
      }
    }
  }

  return (
    <Box className={styles.board}>{board}</Box>
  )
}

const vericalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
const gorizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

