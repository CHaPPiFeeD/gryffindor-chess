import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateException } from 'src/exceptions/nocontent.exception';
import { API_ERROR_CODES } from 'src/enums/errorsCode';
import { UserService } from '../user/user.service';
import { ApiProperty } from '@nestjs/swagger';
import { JwtService } from '../jwt/jwt.service';
import { RegisterDto } from 'src/dto/auth.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  @Inject(UserService)
  private userService: UserService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(MailService)
  private mailService: MailService;

  async register(user: RegisterDto): Promise<string> {
    const candidate = await this.userService.findOne({ email: user.email });

    if (candidate)
      throw new CreateException(API_ERROR_CODES.USER_ALREADY_REGISTERED);

    user.password = await bcrypt.hash(user.password, 8);

    await this.userService.createUser(user);

    const registrationToken = this.jwtService.generateRegistrationToken({
      email: user.email,
    });

    const url = `${process.env.HOST}:${process.env.PORT}?registration_token=${registrationToken}`;

    await this.mailService.sendUserConfirmation(user.email, {
      name: user.username,
      url,
    });

    return 'OK';
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userService.findOne({ email });
    if (!user) throw new CreateException(API_ERROR_CODES.USER_NOT_FOUND);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new CreateException(API_ERROR_CODES.USER_WRONG_PASSWORD);

    this.userService.setOnline({ email }, true);

    const accessToken = this.jwtService.generateAccessToken({ id: user._id });
    return { token: accessToken };
  }
}

export class AuthResponseDto {
  @ApiProperty({ default: 'xxxxx.yyyyy.zzzzz' })
  token: string;
}
