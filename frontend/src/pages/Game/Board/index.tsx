import { Box } from '@mui/system'
import { FC } from 'react';
import styles from './styles.module.scss'

export const Board: FC = () => {
  const board = [];

  for (let i = verticalAxis.length - 1; i >= 0; i--) {
    for (let j = 0; j < gorizontalAxis.length; j++) {
      const number = i + j + 2;

      if (number % 2 === 0) {
        board.push(
          <Box className={styles.cell_black} key={`${i}${j}`} data-row={i + 1} data-col={j + 1}></Box>,
        )
      } else {
        board.push(
          <Box className={styles.cell_white} key={`${i}${j}`} data-row={i + 1} data-col={j + 1}></Box>,
        )
      }
    }
  }

  const gorizontalAxisElements = []

  for (let i = 0; i < gorizontalAxis.length; i++) {
    gorizontalAxisElements.push(
      <Box className={styles.cell}>{gorizontalAxis[i]}</Box>,
    )
  }

  const verticalAxisElements = []

  for (let i = verticalAxis.length - 1; i >= 0; i--) {
    verticalAxisElements.push(
      <Box className={styles.cell}>{verticalAxis[i]}</Box>,
    )
  }


  return (
    <Box className={styles.wrapper}>
      <Box className={styles.gorizontalAxis}>
        {gorizontalAxisElements}
      </Box>
      <Box className={styles.vericalAxisBox}>
        <Box>{verticalAxisElements}</Box>
        <Box className={styles.board}>
          {board}
        </Box>
        <Box>{verticalAxisElements}</Box>
      </Box>

      <Box className={styles.gorizontalAxis}>
        {gorizontalAxisElements}
      </Box>
    </Box>
  )
}

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
const gorizontalAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

