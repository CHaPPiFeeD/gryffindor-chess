import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  login: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
