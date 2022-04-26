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

export type gameStateType = {
  [index: string]: gameType;
};

export class moveDto {
  room: string;
  startPos: [number, number];
  endPos: [number, number];
}
