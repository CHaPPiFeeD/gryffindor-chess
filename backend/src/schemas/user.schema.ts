import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  online: boolean;

  @ApiProperty()
  @Prop()
  parties: number;

  @ApiProperty()
  @Prop()
  partiesWon: number;

  @ApiProperty()
  @Prop()
  rating: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
