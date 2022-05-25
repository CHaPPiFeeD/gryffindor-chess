import { Socket } from 'socket.io';
import { gameType } from './game.dto';

export type movePropsType = {
  client: Socket;
  figure: string;
  game: gameType;
  board: string[][];
  startPos: number[];
  endPos: number[];
  row: number;
  col: number;
  x: number;
  y: number;
};
