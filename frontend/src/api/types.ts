export type gameDataType = {
  board: string[][],
  ways: string[],
  color?: 'white' | 'black' | null,
  moveQueue: 'white' | 'black' | null,
  gameStart?: Date | null,
  log?: logType,
};

type logType = {
  color: string,
  log: string,
}

export type changeFigureDataType = {
  isChange: boolean,
  chooseFigure: null | string,
}

export type moveDataType = {
  startPos: [number, number],
  endPos: [number, number],
  change: changeFigureDataType,
}

export type usersQueueType = {
  socket: string;
  username: string;
  color: string[];
}
