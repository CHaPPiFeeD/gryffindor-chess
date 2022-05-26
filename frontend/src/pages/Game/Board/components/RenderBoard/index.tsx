import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { Figure } from '../Figure';
import styles from './styles.module.scss'

export const RenderBoard = () => {
  const boardState = useSelector((state: RootState) => state.board.board)
  const board: any = []

  boardState.forEach((v, i) => {
    v.forEach((v, j) => {
      const [row, col] = getCoordinate(i, j);
      const number = i + j;

      const figure = (
        <Box
          className={number % 2 === 0 ? styles.cell_white : styles.cell_black}
          id={`${row}${col}`}
          data-row={row}
          data-col={col}
          onClick={handleClick}
        >
          <Figure row={row} col={col} />
        </Box>
      )

      board.push(figure)
    })
  })

  return (
    <Box className={styles.board} id='board'>
      {board}
    </Box>
  );
}

const handleClick = (e: any) => {
  const row = +e.currentTarget.attributes.getNamedItem('data-row')?.value
  const col = +e.currentTarget.attributes.getNamedItem('data-col')?.value

  console.log(row);
  console.log(col);

  e.currentTarget.classList.toggle(styles.active)
}

const getCoordinate = (row: number, col: number): number[] => {
  const colorState = useSelector((state: RootState) => state.board.color);

  const isReverse = colorState === 'black';

  if (isReverse) return [row = Math.abs(row - 7), col = Math.abs(col - 7)];
  return [row, col];
}
