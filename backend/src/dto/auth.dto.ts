import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateDto {
  @ApiProperty({ default: 'user@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RegistrationDto {
  @ApiProperty({ default: 'Name' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 16)
  @Matches(/^((?![^\w\s]).)*$/)
  username: string;

  @ApiProperty({ default: 'xxx.yyy.zzz' })
  @IsNotEmpty()
  @IsString()
  registrationToken: string;

  @ApiProperty({ default: '12345678' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @Matches(/(?=.*[A-z])(?=.*\d).*/)
  password: string;
}

export class LoginDto {
  @ApiProperty({ default: 'user@email.com' })
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
