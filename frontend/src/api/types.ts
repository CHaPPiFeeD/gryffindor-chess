export type gameDataType = {
  board: string[][],
  ways: string[],
  color: 'white' | 'black' | null,
  moveQueue: 'white' | 'black' | null,
};
