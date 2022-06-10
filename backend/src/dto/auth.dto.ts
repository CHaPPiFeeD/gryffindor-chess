import { IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @Length(3)
  username: string;

  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}
