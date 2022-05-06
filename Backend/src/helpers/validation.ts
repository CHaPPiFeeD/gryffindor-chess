import { FIGURES } from '../enum/constants';

export const checkVerticalAndHorizontalMove = (
  board: string[][],
  startPos: number[],
  x: number,
  y: number,
): boolean => {
  const row = startPos[0];
  const column = startPos[1];

  switch (true) {
    case x < 0 && y == 0: // left
      for (let i = 1; -i > x; i++) {
        const column = startPos[1] - i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y == 0: // right
      for (let i = 1; i < x; i++) {
        const column = startPos[1] + i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y > 0: //top
      for (let i = 1; i < y; i++) {
        const row = startPos[0] - i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y < 0: // buttom
      for (let i = 1; -i > y; i++) {
        const row = startPos[0] + i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    default:
      break;
  }
};

export const checkDiagonalMove = (
  board: string[][],
  startPos: number[],
  x: number,
  y: number,
): boolean => {
  switch (true) {
    case x < 0 && y > 0: // top left
      for (let i = 1; -i > x && i < y; i++) {
        const column = startPos[1] - i;
        const row = startPos[0] - i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y > 0: // top right
      for (let i = 1; i < x && i < y; i++) {
        const column = startPos[1] + i;
        const row = startPos[0] - i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x < 0 && y < 0: // buttom left
      for (let i = 1; -i > x && -i > y; i++) {
        const column = startPos[1] - i;
        const row = startPos[0] + i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y < 0: // buttom right
      for (let i = 1; i < x && -i > y; i++) {
        const column = startPos[1] + i;
        const row = startPos[0] + i;
        if (board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;
  }
};

export const checkPawnMove = (
  board: string[][],
  startPos: number[],
  endPos: number[],
  x: number,
  y: number,
  initPawnPos: number,
  step: number,
): boolean => {
  const isStep = y === step && x === 0;

  const isDiagonal =
    Math.abs(x) === 1 &&
    y === step &&
    board[endPos[0]][endPos[1]] !== FIGURES.EMPTY;

  const isTwoSteps =
    startPos[0] !== initPawnPos && y === step + step && x === 0;

  return isStep || isDiagonal || isTwoSteps;
};
