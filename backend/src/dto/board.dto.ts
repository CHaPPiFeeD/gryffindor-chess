import { gameRoomType } from './game.dto';

export type checkWaysPropsType = {
  game: gameRoomType;
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
