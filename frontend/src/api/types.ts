export type gameDataType = {
  board: string[][],
  ways: string[],
  color?: 'white' | 'black' | null,
  moveQueue: 'white' | 'black' | null,
  gameStart?: Date | null,
};

export type changeFigureDataType = {
  isChange: boolean,
  chooseFigure: null | string,
}

export type moveDataType = {
  startPos: [number, number],
  endPos: [number, number],
  change: changeFigureDataType,
}
