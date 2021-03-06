import { GamePlayerType, QueueUserType } from '../types';
import { COLORS } from '../enums/constants';
import { Game } from 'src/models/game.model';
import { ObjectId } from 'mongoose';

export const setPlayerColors = (
  playerOne: QueueUserType,
  playerTwo: QueueUserType,
): {
  whitePlayer: GamePlayerType;
  blackPlayer: GamePlayerType;
} => {
  if (playerOne.color.length === 2 && playerTwo.color.length === 2)
    return setPlayerColorsRandom(playerOne, playerTwo);

  if (
    playerOne.color.includes(COLORS.WHITE) &&
    playerTwo.color.includes(COLORS.BLACK)
  )
    return createPlayerColors(playerOne, playerTwo);

  if (
    playerOne.color.includes(COLORS.BLACK) &&
    playerTwo.color.includes(COLORS.WHITE)
  )
    return createPlayerColors(playerTwo, playerOne);
};

const createPlayerColors = (
  white: QueueUserType,
  black: QueueUserType,
): {
  whitePlayer: GamePlayerType;
  blackPlayer: GamePlayerType;
} => {
  const whitePlayer: GamePlayerType = {
    userId: white.userId,
    socket: white.socket,
    name: white.name,
    offersDraw: false,
    rules: {
      castling: {
        long: true,
        short: true,
      },
      interception: [],
    },
    disconnect: null,
  };

  const blackPlayer: GamePlayerType = {
    userId: black.userId,
    socket: black.socket,
    name: black.name,
    offersDraw: false,
    rules: {
      castling: {
        long: true,
        short: true,
      },
      interception: [],
    },
    disconnect: null,
  };

  return { whitePlayer, blackPlayer };
};

const setPlayerColorsRandom = (
  playerOne: QueueUserType,
  playerTwo: QueueUserType,
): {
  whitePlayer: GamePlayerType;
  blackPlayer: GamePlayerType;
} => {
  const i: number = Math.round(Math.random());
  const firstColor: string = playerOne.color[i];

  if (firstColor === COLORS.WHITE) {
    return createPlayerColors(playerOne, playerTwo);
  } else {
    return createPlayerColors(playerTwo, playerOne);
  }
};

export const alertBoard = (logger, board, room) => {
  let i = 0;
  let j = 8;
  logger.log(`room: ${room}`);
  logger.log(`    0 1 2 3 4 5 6 7`);
  logger.log(`  +-----------------+`);
  board.forEach((value) =>
    logger.log(
      // eslint-disable-next-line prettier/prettier
      `${i++} | ${value[0]} ${value[1]} ${value[2]} ${value[3]} ${value[4]} ${value[5]} ${value[6]} ${value[7]} | ${j--}`,
    ),
  );
  logger.log(`  +-----------------+`);
  logger.log(`    a b c d e f g h`);
};

export const findRoomBySocketId = (socketId: string, gamesStates): string => {
  for (const game of gamesStates.values()) {
    if (game.white.socket === socketId || game.black.socket === socketId)
      return game.id;
  }
};

export const findRoomByUserId = (
  userId: ObjectId,
  gamesStates: Map<string, Game>,
): string => {
  for (const game of gamesStates.values()) {
    if (game.white.userId === userId || game.black.userId === userId)
      return game.id;
  }
};
