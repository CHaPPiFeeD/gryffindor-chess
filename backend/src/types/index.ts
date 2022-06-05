import { Socket } from 'socket.io';
import { Game } from 'src/models/game.model';

export type GamePlayerType = {
  socket: string;
  name: string;
  offersDraw: boolean;
  rules: {
    castling: {
      long: boolean;
      short: boolean;
    };
  };
};

export type MoveType = {
  start: [number, number];
  end: [number, number];
  change: {
    isChangePawn: boolean;
    chooseFigure: null | string;
  };
};

export type LogType = {
  color: string;
  log: string;
};

export type MovePropsType = {
  client: Socket;
  move: MoveType;
  game: Game;
  attackRow?: number;
  attackCol?: number;
  x?: number;
  y?: number;
};

export type RegToQueueDataType = {
  name: string;
  color: string[];
};

export type QueueUserType = {
  socket: string;
  name: string;
  color: string[];
};

export type CheckWaysPropsType = {
  game: Game;
  playerBoard?: string[][];
  playerColor?: string;
  checkRow: number;
  checkCol: number;
  playerWays?: number[][][];
  anotherPlayerWays?: string[];
  ownFigures?: string;
  ownKing?: string;
  pawnWays?: number[][];
};

export type CreateBoardsForPlayersType = {
  whiteBoard: string[][];
  blackBoard: string[][];
  whiteWays: string[];
  blackWays: string[];
};
