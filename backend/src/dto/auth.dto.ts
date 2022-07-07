import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'Name' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 16)
  @Matches(/^((?![^\w\s]).)*$/)
  username: string;

  @ApiProperty({ default: 'email@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345678' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @Matches(/(?=.*[A-z])(?=.*\d).*/)
  password: string;
}

export class LoginDto {
  @ApiProperty({ default: 'email@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345678' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @Matches(/(?=.*[A-z])(?=.*\d).*/)
  password: string;
}
