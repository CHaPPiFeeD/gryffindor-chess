export const findColors = (playerOne, playerTwo) => {
  if (playerOne.color.length === 2 && playerTwo.color.length === 2) {
    return setColorsRandom(playerOne, playerTwo);
  }

  if (playerOne.color.includes('white') && playerTwo.color.includes('black')) {
    return setColors(playerOne, playerTwo);
  }

  if (playerOne.color.includes('black') && playerTwo.color.includes('white')) {
    return setColors(playerTwo, playerOne);
  }
};

const setColors = (whitePlayer, blackPlayer) => {
  const white = {
    socket: whitePlayer.socket,
    name: whitePlayer.name,
  };

  const black = {
    socket: blackPlayer.socket,
    name: blackPlayer.name,
  };

  return { white, black };
};

const setColorsRandom = (playerOne, playerTwo) => {
  const i = Math.round(Math.random());
  const firstColor = playerOne.color[i];

  if (Object.is(firstColor, 'white')) {
    return setColors(playerOne, playerTwo);
  } else {
    return setColors(playerTwo, playerOne);
  }
};
