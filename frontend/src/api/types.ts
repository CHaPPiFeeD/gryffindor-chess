export type gameDataType = {
  board: string[][],
  ways: string[],
  moveQueue: 'white' | 'black' | null,
  gameEnd?: Date | null,
  log?: logType,
  eatFigures: {
    white: string[],
    black: string[],
  },
};

export type gameStartDataType = {
  players: {
    white: string,
    black: string,
  },
  color: string,
  board: string[][],
  ways: string[],
  moveQueue: string,
  gameStart: Date,
}

type logType = {
  color: string,
  log: string,
}

export type changeFigureDataType = {
  isChange: boolean,
  chooseFigure: null | string,
}

export type moveDataType = {
  start: [number, number],
  end: [number, number],
  change: changeFigureDataType,
}

export type usersQueueType = {
  socket: string;
  name: string;
  color: string[];
}
