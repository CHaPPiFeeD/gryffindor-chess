export type gamePlayerType = {
  socket: string;
  name: string;
};

export type gameType = {
  roomName: string;
  white: gamePlayerType;
  black: gamePlayerType;
  board: string[][];
};

export type gameStateType = Map<string, gameType>;

export class MoveDto {
  startPos: [number, number];
  endPos: [number, number];
}
