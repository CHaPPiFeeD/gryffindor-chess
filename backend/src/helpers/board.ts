import { checkWaysPropsType } from 'src/dto/board.dto';
import { COLORS, FIGURES } from 'src/enum/constants';
import { KING_WAYS_CASTLING } from 'src/enum/figureWays';
import { checkCoordinates } from './validation';

export const createWay = (checkRowIndex, checkColIndex, wayRow, wayCol) => {
  return [checkRowIndex, checkColIndex, wayRow, wayCol].join('');
};

export const addWayAndVisibility = (props) => {
  const {
    generalBoard,
    playerBoard,
    wayRow,
    wayCol,
    ownFigures,
    playerWays,
    checkRow,
    checkCol,
  } = props;

  playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
  const endFigure = generalBoard[wayRow][wayCol];

  const isOwnFigure = ownFigures.includes(endFigure);

  if (!isOwnFigure) {
    playerWays.push([
      [checkRow, checkCol],
      [wayRow, wayCol],
    ]);
  }
};

export const checkCastling = (props: checkWaysPropsType) => {
  const { gameRoom, playerColor, playerWays, checkRow, checkCol } = props;

  const castling =
    playerColor === COLORS.WHITE
      ? gameRoom.white.rules.castling
      : gameRoom.black.rules.castling;

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
  props: checkWaysPropsType,
  side,
  isCastlingSide,
): boolean => {
  const { checkRow, checkCol, generalBoard, playerBoard, playerColor } = props;

  if (!isCastlingSide) return;

  const initPos = playerColor === COLORS.WHITE ? [7, 4] : [0, 4];
  if (checkRow !== initPos[0] || checkCol !== initPos[1]) return false;

  let isCastling = true;

  side.forEach((way) => {
    const wayRow = checkRow + way[0];
    const wayCol = checkCol + way[1];

    console.log(wayRow);
    console.log(wayCol);

    const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

    if (isCorrectCoordinates) {
      const isCellNotEmpty = generalBoard[wayRow][wayCol] !== FIGURES.EMPTY;

      if (isCellNotEmpty) isCastling = false;
    }
  });

  if (isCastling) {
    side.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];
      playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
    });
  }

  return isCastling;
};
