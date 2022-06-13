// export type gameDataType = {
//   board: string[][],
//   ways: string[],
//   moveQueue: 'white' | 'black' | null,
//   gameEnd?: Date | null,
//   log?: logType,
//   eatFigures: {
//     white: string[],
//     black: string[],
//   },
//   lastMove: number[][],
// };

export type gameDataType = {
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
