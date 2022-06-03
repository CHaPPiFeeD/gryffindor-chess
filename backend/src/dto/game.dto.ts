export type gamePlayerType = {
  socket: string;
  name: string;
  ways: string[];
  offersDraw: boolean;
  rules: {
    castling: {
      long: boolean;
      short: boolean;
    };
  };
};

export type gameRoomType = {
  roomId: string;
  white: gamePlayerType;
  black: gamePlayerType;
  board: string[][];
  moveQueue: string;
  winner: string | null;
  gameStart: Date;
  gameEnd?: Date;
  log: logType[];
  eatenFigures: {
    white: string[];
    black: string[];
  };
};

export type gameStateType = Map<string, gameRoomType>;

export class MoveDto {
  startPos: [number, number];
  endPos: [number, number];
  change: {
    isChange: boolean;
    chooseFigure: null | string;
  };
}

export type logType = {
  color: string;
  log: string;
};
