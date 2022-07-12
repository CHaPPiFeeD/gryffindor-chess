import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ default: 'Name' })
  @Prop()
  username: string;

  @ApiProperty({ default: 'email@gmai.com' })
  @Prop()
  email: string;

  @ApiProperty({ default: '12345678' })
  @Prop()
  password: string;

  @ApiProperty({ default: true })
  @Prop()
  isVerified: boolean;

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
