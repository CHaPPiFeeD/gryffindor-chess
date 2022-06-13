import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  online: boolean;

  @Prop()
  parties: number;

  @Prop()
  partiesWon: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
