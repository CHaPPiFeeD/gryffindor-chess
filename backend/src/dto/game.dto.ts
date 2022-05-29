export type gamePlayerType = {
  socket: string;
  name: string;
  ways: string[];
};

export type gameRoomType = {
  roomId: string;
  white: gamePlayerType;
  black: gamePlayerType;
  board: string[][];
  moveQueue: string;
};

export type gameStateType = Map<string, gameRoomType>;

export class MoveDto {
  startPos: [number, number];
  endPos: [number, number];
}
