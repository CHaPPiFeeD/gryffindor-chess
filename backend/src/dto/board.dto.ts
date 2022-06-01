import { gameRoomType } from './game.dto';

export type checkWaysPropsType = {
  gameRoom: gameRoomType;
  generalBoard: string[][];
  playerBoard?: string[][];
  playerColor?: 'white' | 'black';
  checkRow: number;
  checkCol: number;
  playerWays?: number[][][];
  anotherPlayerWays?: string[];
  ownFigures?: string;
  ownKing?: string;
  pawnWays?: number[][];
};

export type createBoardsForPlayersType = {
  whiteBoard: string[][];
  blackBoard: string[][];
  whiteWays: string[];
  blackWays: string[];
};
