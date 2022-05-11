import { FIGURES, FIGURES_COLORS } from 'src/enum/constants';
import { KING_WAYS } from 'src/enum/figureWays';
import { checkCoordinates } from './validation';

export const createWay = (checkRowIndex, checkColIndex, wayRow, wayCol) => {
  return [checkRowIndex, checkColIndex, wayRow, wayCol].join('');
};

export const createKingWays = (props): number[][] => {
  const { generalBoard, playerBoard, checkRow, checkCol, ownFigures } = props;

  const kingInitWays = [];

  KING_WAYS.forEach((way) => {
    const wayRow = checkRow + way[0];
    const wayCol = checkCol + way[1];

    const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

    if (isCorrectCoordinates) {
      playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];

      const isOwnFigure = ownFigures.includes(generalBoard[wayRow][wayCol]);

      if (!isOwnFigure) {
        const way = [
          [checkRow, checkCol],
          [wayRow, wayCol],
        ];

        kingInitWays.push(way);
      }
    }
  });

  return kingInitWays;
};

export const checkKingWays = (props, isHaveSide: boolean) => {
  const {
    generalBoard,
    kingWays,
    wayRow,
    wayCol,
    checkRow,
    checkCol,
    side,
    i,
  } = props;

  kingWays.forEach((way, i) => {
    if (way[1][0] === wayRow && way[1][1] === wayCol) {
      kingWays.splice(i, 1);
    }
  });

  if (isHaveSide) {
    const isKingFigure =
      generalBoard[wayRow][wayCol].toLowerCase() === FIGURES.KING;

    if (isKingFigure) {
      const wayRow = checkRow + side[i + 1][0];
      const wayCol = checkCol + side[i + 1][1];

      kingWays.forEach((way, i) => {
        if (way[1][0] === wayRow && way[1][1] === wayCol) {
          kingWays.splice(i, 1);
        }
      });
    }
  }
};

export const checkBoardPos = (props, isHaveSide: boolean) => {
  const {
    game,
    generalBoard,
    playerBoard,
    wayRow,
    wayCol,
    ownFigures,
    ownKing,
    anotherPlayerKing,
    playerWays,
    checkRow,
    checkCol,
  } = props;

  playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
  const endFigure = generalBoard[wayRow][wayCol];

  const isOwnFigure = ownFigures.includes(endFigure);
  const isOwnKingFigure = ownKing === endFigure;
  const isAnotherKingFigure = anotherPlayerKing === endFigure;

  if (!isOwnFigure) {
    playerWays.push([
      [checkRow, checkCol],
      [wayRow, wayCol],
    ]);
  }

  if (!isOwnKingFigure) {
    checkKingWays(props, isHaveSide);
  }

  if (isAnotherKingFigure) {
    if (anotherPlayerKing === FIGURES_COLORS.WHITE.KING) {
      game.white.rules.isRock = true;
    }

    if (anotherPlayerKing === FIGURES_COLORS.BLACK.KING) {
      game.black.rules.isRock = true;
    }
  }
};
