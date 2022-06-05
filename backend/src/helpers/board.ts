import { COLORS, FIGURES } from 'src/enum/constants';
import { KING_WAYS_CASTLING } from 'src/enum/figureWays';
import { CheckWaysPropsType } from 'src/types';
import { checkCoordinates } from './validation';

export const createWay = (checkRowIndex, checkColIndex, wayRow, wayCol) => {
  return [checkRowIndex, checkColIndex, wayRow, wayCol].join('');
};

export const addWayAndVisibility = (props) => {
  const {
    game,
    playerBoard,
    wayRow,
    wayCol,
    ownFigures,
    playerWays,
    checkRow,
    checkCol,
  } = props;

  playerBoard[wayRow][wayCol] = game.board[wayRow][wayCol];
  const endFigure = game.board[wayRow][wayCol];

  const isOwnFigure = ownFigures.includes(endFigure);

  if (!isOwnFigure) {
    playerWays.push([
      [checkRow, checkCol],
      [wayRow, wayCol],
    ]);
  }
};

export const checkCastling = (props: CheckWaysPropsType) => {
  const { game, playerColor, playerWays, checkRow, checkCol } = props;

  const castling =
    playerColor === COLORS.WHITE
      ? game.white.rules.castling
      : game.black.rules.castling;

  if (castling) {
    const isLongCastling = checkCastlingSide(
      props,
      KING_WAYS_CASTLING.TO_LONG_SIDE,
      castling.long,
    );

    if (isLongCastling && castling.long) {
      playerWays.push([
        [checkRow, checkCol],
        [checkRow, 2],
      ]);
    }
  }

  if (castling) {
    const isShortCastling = checkCastlingSide(
      props,
      KING_WAYS_CASTLING.TO_SHORT_SIDE,
      castling.short,
    );

    if (isShortCastling && castling.short) {
      playerWays.push([
        [checkRow, checkCol],
        [checkRow, 6],
      ]);
    }
  }
};

const checkCastlingSide = (
  props: CheckWaysPropsType,
  side,
  isCastlingSide,
): boolean => {
  const { checkRow, checkCol, game, playerBoard, playerColor } = props;

  if (!isCastlingSide) return;

  const initPos = playerColor === COLORS.WHITE ? [7, 4] : [0, 4];
  if (checkRow !== initPos[0] || checkCol !== initPos[1]) return false;

  let isCastling = true;

  side.forEach((way) => {
    const wayRow = checkRow + way[0];
    const wayCol = checkCol + way[1];

    const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

    if (isCorrectCoordinates) {
      const isCellNotEmpty = game.board[wayRow][wayCol] !== FIGURES.EMPTY;

      if (isCellNotEmpty) isCastling = false;
    }
  });

  if (isCastling) {
    side.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];
      playerBoard[wayRow][wayCol] = game.board[wayRow][wayCol];
    });
  }

  return isCastling;
};
