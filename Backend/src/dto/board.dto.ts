import { gameType } from './game.dto';

export type checkWaysPropsType = {
  game: gameType;
  generalBoard: string[][];
  playerBoard?: string[][];
  checkRow: number;
  checkCol: number;
  playerWays?: number[][][];
  anotherPlayerWays?: string[];
  ownFigures?: string;
  ownKing?: string;
  anotherPlayerKing?: string;
  kingWays?: number[][];
  pawnWays?: number[][];
};

export type createBoardsForPlayersType = {
  whiteBoard: string[][];
  blackBoard: string[][];
  whiteWays: string[];
  blackWays: string[];
};
