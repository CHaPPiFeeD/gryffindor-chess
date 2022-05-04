export const checkVerticalAndHorizontalMove = (
  board: string[][],
  startPos: number[],
  x: number,
  y: number,
): boolean => {
  const checkY = startPos[0];
  const checkX = startPos[1];

  switch (true) {
    case x < 0 && y == 0: // left
      for (let index = 1; -index > x; index++) {
        const checkX = startPos[1] - index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
      }
      break;

    case x > 0 && y == 0: // right
      for (let index = 1; index < x; index++) {
        const checkX = startPos[1] + index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
      }
      break;

    case x == 0 && y > 0: //top
      for (let index = 1; index < y; index++) {
        const checkY = startPos[0] - index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
      }
      break;

    case x == 0 && y < 0: // buttom
      for (let index = 1; -index > y; index++) {
        const checkY = startPos[0] + index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
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
      for (let index = 1; -index > x && index < y; index++) {
        const checkX = startPos[1] - index;
        const checkY = startPos[0] - index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
      }
      break;

    case x > 0 && y > 0: // top right
      for (let index = 1; index < x && index < y; index++) {
        const checkX = startPos[1] + index;
        const checkY = startPos[0] - index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
      }
      break;

    case x < 0 && y < 0: // buttom left
      for (let index = 1; -index > x && -index > y; index++) {
        const checkX = startPos[1] - index;
        const checkY = startPos[0] + index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
      }
      break;

    case x > 0 && y < 0: // buttom right
      for (let index = 1; index < x && -index > y; index++) {
        const checkX = startPos[1] + index;
        const checkY = startPos[0] + index;
        if (!Object.is(board[checkY][checkX], '0')) return true;
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
  const isStep = Object.is(y, step) && Object.is(x, 0);

  const isDiagonal =
    Object.is(Math.abs(x), 1) &&
    Object.is(y, step) &&
    !Object.is(board[endPos[0]][endPos[1]], '0');

  const isTwoSteps =
    Object.is(startPos[0], initPawnPos) &&
    Object.is(y, step + step) &&
    Object.is(x, 0);

  return isStep || isDiagonal || isTwoSteps;
};
