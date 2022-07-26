import { WsException } from '@nestjs/websockets';
import WAYS from '../enums/figure-ways';
import { MovePropsType } from '../types';
import { ATTACKS_SCHEME, COLORS, FIGURES } from '../enums/constants';

export const checkVerticalAndHorizontalMove = (
  props: MovePropsType,
): boolean => {
  const { game, move, x, y } = props;

  const row = move.start[0];
  const column = move.start[1];

  switch (true) {
    case x < 0 && y == 0: // left
      for (let i = 1; -i > x; i++) {
        const column = move.start[1] - i;
        if (game.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y == 0: // right
      for (let i = 1; i < x; i++) {
        const column = move.start[1] + i;
        if (game.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y > 0: //top
      for (let i = 1; -i > y; i++) {
        const row = move.start[0] - i;
        if (game.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y < 0: // buttom
      for (let i = 1; i < y; i++) {
        const row = move.start[0] + i;
        if (game.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    default:
      break;
  }
};

export const checkDiagonalMove = (props: MovePropsType): boolean => {
  const { game, move, x, y } = props;

  switch (true) {
    case x < 0 && y < 0: // top left
      for (let i = 1; -i > x && -i > y; i++) {
        const col = move.start[1] - i;
        const row = move.start[0] - i;
        if (game.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y > 0: // top right
      for (let i = 1; i < x && -i > y; i++) {
        const col = move.start[1] + i;
        const row = move.start[0] - i;
        if (game.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x < 0 && y < 0: // buttom left
      for (let i = 1; -i > x && i < y; i++) {
        const col = move.start[1] - i;
        const row = move.start[0] + i;
        if (game.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y < 0: // buttom right
      for (let i = 1; i < x && i < y; i++) {
        const col = move.start[1] + i;
        const row = move.start[0] + i;
        if (game.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;
  }
};

export const validCoordinate = (row: number, col: number) => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const checkSchemeAttack = (props: MovePropsType) => {
  const { attackRow, attackCol, game, move } = props;
  const startFigure = game.getFigureFromStart(move);

  if (
    startFigure.toLowerCase() === FIGURES.BLACK.KING &&
    checkKingCastle(props)
  )
    return;

  const isSchemeAttack = ATTACKS_SCHEME[attackRow][attackCol].includes(
    startFigure.toLowerCase(),
  );

  if (!isSchemeAttack)
    throw new WsException('A figure cannot move to this cell');
};

export const checkKingCastle = (props: MovePropsType) => {
  const { client, game, move } = props;
  const [clientColor] = game.getColorsBySocket(client.id);

  let castling, initRow;

  if (clientColor === COLORS.WHITE) {
    castling = game.white.rules.castling;
    initRow = 7;
  }

  if (clientColor === COLORS.BLACK) {
    castling = game.black.rules.castling;
    initRow = 0;
  }

  const isLongCastlingAllow = checkCastlingSide(
    props,
    WAYS.KING_CASTLING.TO_LONG_SIDE,
  );

  const isShortCastlingAllow = checkCastlingSide(
    props,
    WAYS.KING_CASTLING.TO_SHORT_SIDE,
  );

  const isShort = move.end[0] === initRow && move.end[1] === 6;
  const isLong = move.end[0] === initRow && move.end[1] === 2;

  if (isLongCastlingAllow && castling.long && isLong) {
    game[clientColor].rules.castling.long = false;
    game[clientColor].rules.castling.short = false;
    const rook = game.board[initRow][0];
    game.board[initRow][3] = rook;
    game.board[initRow][0] = FIGURES.EMPTY;
    return true;
  }

  if (isShortCastlingAllow && castling && isShort) {
    game[clientColor].rules.castling.long = false;
    game[clientColor].rules.castling.short = false;
    const rook = game.board[initRow][0];
    game.board[initRow][5] = rook;
    game.board[initRow][7] = FIGURES.EMPTY;
    return true;
  }

  return false;
};

const checkCastlingSide = (props: MovePropsType, side): boolean => {
  const { client, move, game } = props;
  const [clientColor] = game.getColorsBySocket(client.id);

  const initPos = clientColor === COLORS.WHITE ? [7, 4] : [0, 4];
  if (move.start[0] !== initPos[0] || move.start[1] !== initPos[1])
    return false;

  let isCastling = true;

  side.forEach((way) => {
    const wayRow = move.start[0] + way[0];
    const wayCol = move.start[1] + way[1];

    const isCorrectCoordinates = validCoordinate(wayRow, wayCol);

    if (isCorrectCoordinates) {
      const isCellNotEmpty = game.board[wayRow][wayCol] !== FIGURES.EMPTY;

      if (isCellNotEmpty) isCastling = false;
    }
  });

  return isCastling;
};
