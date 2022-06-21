import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getGame } from '../../../../api/socket';
import { GameDataType } from '../../../../api/types';
import { useAppDispatch } from '../../../../hooks/redux';
import { RootState } from '../../../../store';
import {
  setGame,
  setEndPosition,
  setMove,
} from '../../../../store/game/gameSlise';
import { Figure } from '../../../../components';
import styles from './styles.module.scss';
import { setOpen } from '../../../../store/modal/modalSlise';
import { BLACK_FIGURES, WHITE_FIGURES } from '../../../../constants';
import { MODAL } from '../../../../constants/modal';


export const RenderBoard = () => {
  const boardRef = useRef(document.getElementById('board'));
  const dispatch = useAppDispatch();
  const {
    board: boardStore,
    color: colorStore,
    activePosition: activePositionStore,
    ways: waysStore,
    moveQueue: moveQueueStore,
    lastMove: lastMoveStore,
  } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    getGame((data: GameDataType) => dispatch(setGame(data)));
  }, []);

  const handleClick = (e: any) => {
    const row = +e.currentTarget.attributes.getNamedItem('data-row')?.value;
    const col = +e.currentTarget.attributes.getNamedItem('data-col')?.value;
    const color: string =
      e.currentTarget.attributes.getNamedItem('data-color')?.value;

    if (moveQueueStore !== colorStore || !waysStore.length) return;

    let isTransformPawn;

    if (activePositionStore) {
      removeAllClasses(boardRef);

      isTransformPawn =
        checkTransformPawn(activePositionStore, boardStore, colorStore, row);
    }

    if (!activePositionStore) {
      const [rowBoard, colBoard] = getCoordinate(row, col, colorStore);

      if (color !== colorStore) return;

      addActiveClass(boardRef, rowBoard, colBoard);
      addWaysClasses(waysStore, row, col, colorStore, boardRef);
    }

    if (isTransformPawn) {
      dispatch(setEndPosition([row, col]));
      dispatch(setOpen(MODAL.CHANGE_PAWN));
    }

    if (!isTransformPawn) {
      dispatch(setMove(
        activePositionStore,
        [row, col],
        { isChange: false, chooseFigure: null },
      ));
    }
  };

  return (
    <Box className={styles.board} ref={boardRef} id='board'>
      {boardStore?.map((v, i) => {
        return <Box key={i} style={{ display: 'flex' }}>
          {v.map((v: any, j: number) => {
            const [row, col] = getCoordinate(i, j, colorStore);
            const l = colorStore === 'black' ? 1 : 0;
            const number = i + j + l;
            const style =
              number % 2 === 0 ? styles.cell_white : styles.cell_black;
            const cell = boardStore[row][col];
            let moveStyle;
            lastMoveStore?.forEach((v) => {
              if (v[0] === row && v[1] === col) moveStyle = styles.last_move;
            });

            let color;

            if (WHITE_FIGURES.includes(cell)) color = 'white';
            if (BLACK_FIGURES.includes(cell)) color = 'black';

            return (
              <Box
                className={[style, moveStyle].join(' ')}
                key={col}
                id={`${row}${col}`}
                data-row={row}
                data-col={col}
                data-color={color}
                onClick={handleClick}
              >
                <Figure cell={boardStore[row][col]} />
              </Box>
            );
          })}
        </Box>;
      })}
    </Box>
  );
};

const removeAllClasses = (
  boardRef: React.MutableRefObject<HTMLElement | null>,
) => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      boardRef?.current?.children[i]?.children[j].classList.remove(
        styles.active,
        styles.ellips,
        styles.circle,
      );
    }
  }
};

const checkTransformPawn = (
  activePos: number[],
  boardStore: string[][],
  color: string,
  row: number,
) => {
  const [startRow, startCol] = activePos;
  const figure = boardStore[startRow][startCol];
  const pawn = color === 'white' ? 'P' : 'p';
  const endRow = color === 'white' ? 0 : 7;
  return figure === pawn && row === endRow;
};

const getCoordinate = (row: number, col: number, color: string): number[] => {
  const isReverse = color === 'black';
  if (isReverse) return [Math.abs(row - 7), Math.abs(col - 7)];
  return [row, col];
};

const addActiveClass = (
  boardRef: React.MutableRefObject<HTMLElement | null>,
  row: number,
  col: number,
) => {
  const cell = boardRef?.current?.children[row]?.children[col];

  const isNotEmpty =
    cell !== undefined &&
    cell.childElementCount &&
    !cell.children[0].classList.value.includes('fog_wrapper');

  if (isNotEmpty) {
    cell.classList.add(styles.active);
  } else return;
};

const addWaysClasses = (
  ways: string[],
  row: number,
  col: number,
  color: string,
  boardRef: React.MutableRefObject<HTMLElement | null>,
) => {
  ways.forEach((v) => {
    const way = v.split('');
    const [start, end] = [
      [+way[0], +way[1]],
      [+way[2], +way[3]],
    ];

    const isAllowWay =
      row === start[0] &&
      col === start[1];

    if (isAllowWay) {
      const [rowBoard, colBoard] = getCoordinate(end[0], end[1], color);
      const cell = boardRef?.current?.children[rowBoard]?.children[colBoard];

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
  });
};
