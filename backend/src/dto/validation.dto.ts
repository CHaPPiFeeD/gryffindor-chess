import { Socket } from 'socket.io';
import { gameRoomType } from './game.dto';

export type colorsType = 'white' | 'black';

export type movePropsType = {
  client: Socket;
  startPos: number[];
  endPos: number[];
  gameRoom: gameRoomType;
  figure: string;
  attackRow?: number;
  attackCol?: number;
  x?: number;
  y?: number;
  endFigure?: string;
  nextPlayerMove?: colorsType;
  clientColor?: colorsType;
  change: {
    isChange: boolean;
    chooseFigure: null | string;
  };
};
