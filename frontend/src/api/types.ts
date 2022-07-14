export type GameDataType = {
  players: {
    white: string,
    black: string,
  },
  color: string,
  gameStart: Date,
  board: string[][],
  ways: string[],
  moveQueue: 'white' | 'black' | null,
  gameEnd?: Date | null,
  log?: string[],
  eatFigures: {
    white: string[],
    black: string[],
  },
  lastMove?: number[][],
  title: string,
  message: string,
}

export type ChangeFigureDataType = {
  isChangePawn: boolean,
  chooseFigure: null | string,
}

export type MoveDatatype = {
  start: [number, number],
  end: [number, number],
  changeFigure?: ChangeFigureDataType,
}

export type UsersQueueType = {
  socket: string;
  name: string;
  color: string[];
}
