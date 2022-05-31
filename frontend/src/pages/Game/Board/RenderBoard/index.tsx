import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getBoard } from '../../../../api/socket';
import { gameDataType } from '../../../../api/types';
import { useAppDispatch } from '../../../../hooks/redux';
import { RootState } from '../../../../store';
import { setBoard, setEndPosition, setMove } from '../../../../store/game/gameSlise';
import { Figure } from '../../../../components';
import styles from './styles.module.scss';
import { setOpen } from '../../../../store/modal/modalSlise';

export const RenderBoard = () => {
  const boardRef = useRef(document.getElementById('board'));
  const dispatch = useAppDispatch()
  const {
    board: boardStore,
    color: colorStore,
    activePosition: activePositionStore,
    ways: waysStore,
    moveQueue: moveQueueStore,
  } = useSelector((state: RootState) => state.game)

  useEffect(() => {
    getBoard((data: gameDataType) => dispatch(setBoard(data)))
  }, [])

  const getCoordinate = (row: number, col: number): number[] => {
    const isReverse = colorStore === 'black';
    if (isReverse) return [Math.abs(row - 7), Math.abs(col - 7)];
    return [row, col];
  }

  const handleClick = (e: any) => {
    const row = +e.currentTarget.attributes.getNamedItem('data-row')?.value;
    const col = +e.currentTarget.attributes.getNamedItem('data-col')?.value;
    let isChangeFigure;

    if (moveQueueStore !== colorStore) return;

    if (activePositionStore) {
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

      const [startRow, startCol] = activePositionStore;
      const figure = boardStore[startRow][startCol];
      const pawn = colorStore === 'white' ? 'P' : 'p';
      isChangeFigure = figure === pawn && row === 0 || row === 7;
    }

    if (!activePositionStore) {
      const [rowBoard, colBoard] = getCoordinate(row, col);
      const cell = boardRef?.current?.children[rowBoard]?.children[colBoard];

      const isNotEmpty =
        cell !== undefined &&
        cell.childElementCount &&
        !cell.children[0].classList.value.includes('fog_wrapper');

      if (isNotEmpty) {
        cell.classList.add(styles.active);
      } else return;

      waysStore.forEach((v) => {
        const way = v.split('');
        const [start, end] = [
          [+way[0], +way[1]],
          [+way[2], +way[3]],
        ]

        const isAllowWay =
          row === start[0] &&
          col === start[1];

        if (isAllowWay) {
          const [rowBoard, colBoard] = getCoordinate(end[0], end[1])
          const cell = boardRef?.current?.children[rowBoard]?.children[colBoard]

          const isNotUndefined = cell !== undefined;

          if (isNotUndefined) {
            const isNotEmpty = cell.childElementCount;

            if (isNotEmpty) {
              cell.classList.add(styles.circle);
            }

            if (!isNotEmpty) {
              cell.classList.add(styles.ellips);
            }
          }
        }
      })
    }

    console.log(isChangeFigure);

    if (isChangeFigure) {
      dispatch(setEndPosition([row, col]))
      dispatch(setOpen('changeFigure'))
    }
    
    if (!isChangeFigure) {
      dispatch(setMove(
        activePositionStore,
        [row, col],
        { isChange: false, chooseFigure: null },
      ))
    }
  }

  return (
    <Box className={styles.board} ref={boardRef} id='board'>
      {boardStore.map((v, i) => {
        return <Box key={i} style={{ display: 'flex' }}>
          {v.map((v: any, j: number) => {
            const [row, col] = getCoordinate(i, j);
            const l = colorStore === 'black' ? 1 : 0;
            const number = i + j + l;
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
