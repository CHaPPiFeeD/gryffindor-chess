import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { GamePlayerType, InterceptionType, LogType } from 'src/types';

export type PartyDocument = Party & Document;

@Schema()
export class Party {
  @Prop()
  id: string;

  @Prop()
  white: {
    userId: string;
    socket: string;
    name: string;
    offersDraw: boolean;
    rules: {
      castling: {
        long: boolean;
        short: boolean;
      };
      interception: {
        move: {
          start: number[];
          end: number[];
        };
        figurePosition: number[];
      };
    };
    disconnect: string | null;
  };

  @Prop()
  black: {
    userId: string;
    socket: string;
    name: string;
    offersDraw: boolean;
    rules: {
      castling: {
        long: boolean;
        short: boolean;
      };
      interception: {
        move: {
          start: number[];
          end: number[];
        };
        figurePosition: number[];
      };
    };
    disconnect: string | null;
  };

  @Prop()
  board: string[][];

  @Prop()
  eatenFigures: {
    white: string[];
    black: string[];
  };

  @Prop()
  moveQueue: string;

  @Prop()
  winner: string | null;

  @Prop()
  gameStart: Date;

  @Prop()
  gameEnd?: Date;

  @Prop()
  log: {
    color: string;
    log: string;
  };
}

export const PartySchema = SchemaFactory.createForClass(Party);
