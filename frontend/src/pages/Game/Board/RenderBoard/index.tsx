import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getBoard } from '../../../../api/socket';
import { startGameDataType } from '../../../../api/types';
import { useAppDispatch } from '../../../../hooks/redux';
import { RootState } from '../../../../store';
import { setBoard, setMove } from '../../../../store/board/boardSlise';
import { Figure } from '../Figure';
import styles from './styles.module.scss'

export const RenderBoard = () => {
  const boardStore = useSelector((state: RootState) => state.board.board)
  const colorStore = useSelector((state: RootState) => state.board.color);
  const activePosStore = useSelector((state: RootState) => state.board.activePos);
  const waysStore = useSelector((state: RootState) => state.board.ways);
  const boardRef = useRef(document.getElementById('board'));
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
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardRef?.current?.children[i]?.children[j].classList.remove(
            styles.active,
            styles.ellips,
            styles.circle,
            styles.active,
          )
        }
      }
    }

    if (!activePosStore) {
      const [rowBoard, colBoard] = getCoordinate(row, col)
      const cell = boardRef?.current?.children[rowBoard]?.children[colBoard]

      if (cell !== undefined && cell.childElementCount) {
        cell.classList.add(styles.active);
      } else return;

      waysStore.forEach((v) => {
        const way = v.split('');
        const [start, end] = [
          [+way[0], +way[1]], 
          [+way[2], +way[3]],
        ]

        if (row === start[0] && col === start[1]) {
          const [rowBoard, colBoard] = getCoordinate(end[0], end[1])
          const cell = boardRef?.current?.children[rowBoard]?.children[colBoard]

          if (cell !== undefined) {
            if (cell.childElementCount) {
              cell.classList.add(styles.circle);
            } else {
              cell.classList.add(styles.ellips);
            }
          }
        }
      })
    }

    dispatch(setMove(activePosStore, [row, col]))
  }

  return (
    <Box className={styles.board} ref={boardRef} id='board'>
      {boardStore.map((v, i) => {
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
