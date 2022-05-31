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
