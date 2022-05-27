import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBoard } from '../../../../../api/socket';
import { startGameDataType } from '../../../../../api/types';
import { useAppDispatch } from '../../../../../hooks/redux';
import { RootState } from '../../../../../store';
import { setBoard, setMove } from '../../../../../store/board/boardSlise';
import { Figure } from '../Figure';
import styles from './styles.module.scss'

export const RenderBoard = () => {
  const boardStore = useSelector((state: RootState) => state.board.board)
  const colorStore = useSelector((state: RootState) => state.board.color);
  const activePosStore = useSelector((state: RootState) => state.board.activePos);
  const dispatch = useAppDispatch()

  useEffect(() => {
    getBoard((data: startGameDataType) => dispatch(setBoard(data)))
  }, [])

  const getCoordinate = (row: number, col: number): number[] => {
    const isReverse = colorStore === 'black';
    if (isReverse) return [Math.abs(row - 7), Math.abs(col - 7)];
    return [row, col];
  }

  const handleClick = (e: any) => {
    const row = +e.currentTarget.attributes.getNamedItem('data-row')?.value;
    const col = +e.currentTarget.attributes.getNamedItem('data-col')?.value;

    if (activePosStore) {
      if (activePosStore[0] === row && activePosStore[1] === col) {
        e.currentTarget.classList.toggle(styles.active);
      }
    } else {
      e.currentTarget.classList.add(styles.active);
    }

    dispatch(setMove(activePosStore, [row, col]))
  }

  return (
    <Box className={styles.board} id='board'>
      {boardStore.map((v, i) => {
        console.log(v);

        return <Box key={i} style={{ display: 'flex' }}>
          {v.map((v: any, j: number) => {
            const [row, col] = getCoordinate(i, j);
            const number = i + j;
            const style = number % 2 === 0 ? styles.cell_white : styles.cell_black

            return (
              <Box
                className={style}
                key={col}
                id={`${row}${col}`}
                data-row={row}
                data-col={col}
                onClick={handleClick}
              >
                <Figure row={row} col={col} />
              </Box>
            )
          })}
        </Box>
      })}
    </Box>
  );
}
