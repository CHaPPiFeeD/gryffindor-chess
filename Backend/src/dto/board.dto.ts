export type checkWaysPropsType = {
  generalBoard: string[][];
  playerBoard?: string[][];
  checkRow: number;
  checkCol: number;
  playerWays?: number[][][];
  ownFigures?: string;
  anotherPlayerWays?: string[];
  ownKing?: string;
  kingWays?: number[][];
  pawnWays?: number[][][];
};

export type createBoardsForPlayersType = {
  whiteBoard: string[][];
  blackBoard: string[][];
  whiteWays: string[];
  blackWays: string[];
};
