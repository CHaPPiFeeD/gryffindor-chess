import { gamePlayerType } from '../dto/game.dto';
import { userQueueDto } from '../dto/queue.dto';
import { CHESS_COLORS } from '../enum/constants';

export const findColors = (
  playerOne: userQueueDto,
  playerTwo: userQueueDto,
): {
  white: gamePlayerType;
  black: gamePlayerType;
} => {
  if (playerOne.color.length === 2 && playerTwo.color.length === 2) {
    return setColorsRandom(playerOne, playerTwo);
  }

  if (
    playerOne.color.includes(CHESS_COLORS.WHITE) &&
    playerTwo.color.includes(CHESS_COLORS.BLACK)
  ) {
    return setColors(playerOne, playerTwo);
  }

  if (
    playerOne.color.includes(CHESS_COLORS.BLACK) &&
    playerTwo.color.includes(CHESS_COLORS.WHITE)
  ) {
    return setColors(playerTwo, playerOne);
  }
};

const setColors = (
  whitePlayer: userQueueDto,
  blackPlayer: userQueueDto,
): {
  white: gamePlayerType;
  black: gamePlayerType;
} => {
  const white: gamePlayerType = {
    socket: whitePlayer.socket,
    name: whitePlayer.name,
  };

  const black: gamePlayerType = {
    socket: blackPlayer.socket,
    name: blackPlayer.name,
  };

  return { white, black };
};

const setColorsRandom = (
  playerOne: userQueueDto,
  playerTwo: userQueueDto,
): {
  white: gamePlayerType;
  black: gamePlayerType;
} => {
  const i: number = Math.round(Math.random());
  const firstColor: string = playerOne.color[i];

  if (Object.is(firstColor, CHESS_COLORS.WHITE)) {
    return setColors(playerOne, playerTwo);
  } else {
    return setColors(playerTwo, playerOne);
  }
};
