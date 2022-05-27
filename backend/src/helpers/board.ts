import { KING_WAYS } from 'src/enum/figureWays';
import { checkCoordinates } from './validation';

export const createWay = (checkRowIndex, checkColIndex, wayRow, wayCol) => {
  return [checkRowIndex, checkColIndex, wayRow, wayCol].join('');
};

export const createKingWays = (props) => {
  const {
    generalBoard,
    playerBoard,
    checkRow,
    checkCol,
    ownFigures,
    kingWays,
  } = props;

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

        kingWays.push(way);
      }
    }
  });
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
