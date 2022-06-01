export type gamePlayerType = {
  socket: string;
  name: string;
  ways: string[];
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
  winner: null | 'white' | 'black';
  gameStart: Date;
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
