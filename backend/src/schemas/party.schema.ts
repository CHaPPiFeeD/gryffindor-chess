import { SchemaFactory, Schema, Prop, raw } from '@nestjs/mongoose';

export type PartyDocument = Party & Document;

@Schema()
export class Party {
  @Prop(
    raw({
      userId: { type: String },
      name: { type: String },
    }),
  )
  white: Record<string, any>;

  @Prop(
    raw({
      userId: { type: String },
      name: { type: String },
    }),
  )
  black: Record<string, any>;

  @Prop()
  board: string[][];

  @Prop(
    raw({
      white: { type: Array },
      black: { type: Array },
    }),
  )
  eatenFigures: Record<string, any>;

  @Prop()
  winner: string;

  @Prop()
  gameStart: Date;

  @Prop()
  gameEnd: Date;

  @Prop()
  log: string[];
}

export const PartySchema = SchemaFactory.createForClass(Party);
