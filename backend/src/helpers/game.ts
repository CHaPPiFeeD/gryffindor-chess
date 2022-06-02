import { Socket } from 'socket.io';
import { gamePlayerType, gameStateType } from '../dto/game.dto';
import { UserQueueDto } from '../dto/queue.dto';
import { COLORS, INIT_BOARD } from '../enum/constants';

export function Game(roomId, whitePlayer, blackPlayer) {
  this.roomId = roomId;
  this.white = whitePlayer;
  this.black = blackPlayer;
  this.board = INIT_BOARD();
  this.moveQueue = COLORS.WHITE;
  this.winner = null;
  this.gameStart = new Date();
  this.log = [];
}

export const getPlayersColors = (client, gameRoom) => {
  let clientColor, enemyColor;

  if (client.id === gameRoom.white.socket) {
    clientColor = COLORS.WHITE;
    enemyColor = COLORS.BLACK;
  }

  if (client.id === gameRoom.black.socket) {
    clientColor = COLORS.BLACK;
    enemyColor = COLORS.WHITE;
  }

  return [clientColor, enemyColor];
};

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
    playerOne.color.includes(COLORS.WHITE) &&
    playerTwo.color.includes(COLORS.BLACK)
  ) {
    return setColors(playerOne, playerTwo);
  }

  if (
    playerOne.color.includes(COLORS.BLACK) &&
    playerTwo.color.includes(COLORS.WHITE)
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
    name: whitePlayer.username,
    ways: [],
    rules: {
      castling: {
        long: true,
        short: true,
      },
    },
    eatenFigures: [],
  };

  const black: gamePlayerType = {
    socket: blackPlayer.socket,
    name: blackPlayer.username,
    ways: [],
    rules: {
      castling: {
        long: true,
        short: true,
      },
    },
    eatenFigures: [],
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

  if (firstColor === COLORS.WHITE) {
    return setColors(playerOne, playerTwo);
  } else {
    return setColors(playerTwo, playerOne);
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

export const findRoom = (
  client: Socket,
  gamesStates: gameStateType,
): string => {
  for (const game of gamesStates.values()) {
    if (game.white.socket === client.id || game.black.socket === client.id)
      return game.roomId;
  }
};
