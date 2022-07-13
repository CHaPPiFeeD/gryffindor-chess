import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateException } from 'src/exceptions/nocontent.exception';
import { API_ERROR_CODES } from 'src/enums/errorsCode';
import { UserService } from '../user/user.service';
import { ApiProperty } from '@nestjs/swagger';
import { JwtService } from '../jwt/jwt.service';
import { registrationDto } from 'src/dto/auth.dto';
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

  async registration(user: registrationDto): Promise<string> {
    const decoded: any = this.jwtService.verifyToken(user.registrationToken);
    if (!decoded) throw new CreateException(API_ERROR_CODES.INVALID_TOKEN)

    const { email } = decoded;
    const candidate = await this.userService.findOne({ email });

    if (candidate.isVerified)
      throw new CreateException(API_ERROR_CODES.USER_ALREADY_REGISTERED);

    user.password = await bcrypt.hash(user.password, 8);
    await this.userService.registration(email, user);
    this.logger.log(`User registered: ${email}`);

    return 'OK';
  }

  async create(email: string): Promise<string> {
    const isCreated = await this.userService.findOne({ email });

    if (isCreated)
      throw new CreateException(API_ERROR_CODES.USER_ALREADY_REGISTERED);

    await this.userService.create(email);
    const registrationToken = this.jwtService.generateRegistrationToken({ email });
    const url = `${process.env.CLIENT_HOST}?registration_token=${registrationToken}`;
    await this.mailService.sendUserConfirmation(email, { url });
    this.logger.log(`User created: ${email}`);

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
