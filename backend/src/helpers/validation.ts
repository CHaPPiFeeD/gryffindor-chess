import { WsException } from '@nestjs/websockets';
import { movePropsType } from 'src/dto/validation.dto';
import { KING_WAYS_CASTLING } from 'src/enum/figureWays';
import { ATTACKS_SCHEME, COLORS, FIGURES } from '../enum/constants';

export const checkVerticalAndHorizontalMove = (
  props: movePropsType,
): boolean => {
  const { gameRoom, startPos, x, y } = props;

  const row = startPos[0];
  const column = startPos[1];

  switch (true) {
    case x < 0 && y == 0: // left
      for (let i = 1; -i > x; i++) {
        const column = startPos[1] - i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y == 0: // right
      for (let i = 1; i < x; i++) {
        const column = startPos[1] + i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y > 0: //top
      for (let i = 1; -i > y; i++) {
        const row = startPos[0] - i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y < 0: // buttom
      for (let i = 1; i < y; i++) {
        const row = startPos[0] + i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    default:
      break;
  }
};

export const checkDiagonalMove = (props: movePropsType): boolean => {
  const { gameRoom, startPos, x, y } = props;

  switch (true) {
    case x < 0 && y < 0: // top left
      for (let i = 1; -i > x && -i > y; i++) {
        const col = startPos[1] - i;
        const row = startPos[0] - i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y > 0: // top right
      for (let i = 1; i < x && -i > y; i++) {
        const col = startPos[1] + i;
        const row = startPos[0] - i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x < 0 && y < 0: // buttom left
      for (let i = 1; -i > x && i < y; i++) {
        const col = startPos[1] - i;
        const row = startPos[0] + i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y < 0: // buttom right
      for (let i = 1; i < x && i < y; i++) {
        const col = startPos[1] + i;
        const row = startPos[0] + i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;
  }
};

export const checkCoordinates = (wayRow: number, wayCol: number) => {
  return wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8;
};

export const checkSchemeAttack = (props: movePropsType) => {
  const { attackRow, attackCol, figure } = props;

  if (figure.toLowerCase() === FIGURES.BLACK_KING) {
    const isCastling = checkKingCastle(props);

    if (isCastling) return;
  }

  const isSchemeAttack = ATTACKS_SCHEME[attackRow][attackCol].includes(
    figure.toLowerCase(),
  );

  if (!isSchemeAttack)
    throw new WsException('A figure cannot move to this cell');
};

export const checkKingCastle = (props: movePropsType) => {
  const { clientColor, gameRoom, endPos } = props;

  let castling, initRow;

  if (clientColor === COLORS.WHITE) {
    castling = gameRoom.white.rules.castling;
    initRow = 7;
  }

  if (clientColor === COLORS.BLACK) {
    castling = gameRoom.black.rules.castling;
    initRow = 0;
  }

  const isLongCastlingAllow = checkCastlingSide(
    props,
    KING_WAYS_CASTLING.TO_LONG_SIDE,
  );

  const isShortCastlingAllow = checkCastlingSide(
    props,
    KING_WAYS_CASTLING.TO_SHORT_SIDE,
  );

  const isShort = endPos[0] === initRow && endPos[1] === 6;
  const isLong = endPos[0] === initRow && endPos[1] === 2;

  if (isLongCastlingAllow && castling.long && isLong) {
    gameRoom[clientColor].rules.castling.long = false;
    gameRoom[clientColor].rules.castling.short = false;
    const rook = gameRoom.board[initRow][0];
    gameRoom.board[initRow][3] = rook;
    gameRoom.board[initRow][0] = FIGURES.EMPTY;
    return true;
  }

  if (isShortCastlingAllow && castling && isShort) {
    gameRoom[clientColor].rules.castling.long = false;
    gameRoom[clientColor].rules.castling.short = false;
    const rook = gameRoom.board[initRow][0];
    gameRoom.board[initRow][5] = rook;
    gameRoom.board[initRow][7] = FIGURES.EMPTY;
    return true;
  }

  return false;
};

const checkCastlingSide = (props: movePropsType, side): boolean => {
  const { startPos, gameRoom, clientColor } = props;

  const initPos = clientColor === COLORS.WHITE ? [7, 4] : [0, 4];
  if (startPos[0] !== initPos[0] || startPos[1] !== initPos[1]) return false;

  let isCastling = true;

  side.forEach((way) => {
    const wayRow = startPos[0] + way[0];
    const wayCol = startPos[1] + way[1];

    const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

    if (isCorrectCoordinates) {
      const isCellNotEmpty = gameRoom.board[wayRow][wayCol] !== FIGURES.EMPTY;

      if (isCellNotEmpty) isCastling = false;
    }
  });

  return isCastling;
};
