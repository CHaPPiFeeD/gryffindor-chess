import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'Name' })
  @Length(3)
  username: string;

  @ApiProperty({ default: 'email@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345678' })
  @Length(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ default: 'email@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345678' })
  @Length(8)
  password: string;
}
