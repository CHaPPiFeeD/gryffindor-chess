import { gamePlayerType } from '../dto/game.dto';
import { UserQueueDto } from '../dto/queue.dto';
import { CHESS_COLORS } from '../enum/constants';

export const findColors = (
  playerOne: UserQueueDto,
  playerTwo: UserQueueDto,
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
  whitePlayer: UserQueueDto,
  blackPlayer: UserQueueDto,
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
  playerOne: UserQueueDto,
  playerTwo: UserQueueDto,
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
