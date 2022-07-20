import { ObjectId } from 'mongoose';
import { Socket } from 'socket.io';
import { ChessMoveDto } from '../dto/gateway.dto';
import { Game } from '../models/game.model';

export type GamePlayerType = {
  userId: ObjectId;
  socket: string;
  name: string;
  offersDraw: boolean;
  ways: string[];
  rules: {
    castling: {
      long: boolean;
      short: boolean;
    };
    interception: InterceptionType[];
    check?: boolean;
  };
  disconnect: string | null;
};

export type InterceptionType = {
  move: {
    start: number[];
    end: number[];
  };
  figurePosition: number[];
};

export type MovePropsType = {
  client: Socket;
  move: ChessMoveDto;
  game: Game;
  attackRow: number;
  attackCol: number;
  x: number;
  y: number;
};

export type QueueUserType = {
  userId: ObjectId;
  socket: string;
  name: string;
  color: string[];
  mode: string;
};

export type CreateWaysPropsType = {
  game?: Game;
  data?: any;
  color?: string;
  checkRow?: number;
  checkCol?: number;
  ways?: number[][][];
  pawnWays?: number[][];
  king?: string;
  kingWays?: number[][][];
  opponentsKing?: string;
  opponentsKingsWays?: number[][][];
  opponentsColor?: string;
  figures?: string;
};

export type CheckWaysPropsType = {
  game?: Game;
  playerBoard?: string[][];
  playerColor?: string;
  checkRow?: number;
  checkCol?: number;
  playerWays?: number[][][];
  anotherPlayerWays?: string[];
  ownFigures?: string;
  ownKing?: string;
  pawnWays?: number[][];
  kingWays?: number[][];
};

export type CreateBoardsForPlayersType = {
  whiteBoard: string[][];
  blackBoard: string[][];
  whiteWays: string[];
  blackWays: string[];
};

export type ISocket = Socket & {
  user: any;
};
