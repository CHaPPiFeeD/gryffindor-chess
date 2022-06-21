import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateException } from 'src/exceptions/nocontent.exception';
import { generateAccessToken } from 'src/utils';
import { API_ERROR_CODES } from 'src/enums/errorsCode';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  @Inject(UserService)
  private userService: UserService;

  async register(username: string, email: string, password: string) {
    const candidate = await this.userService.findOne({ email });
    if (candidate)
      throw new CreateException(API_ERROR_CODES.USER_ALREADY_REGISTERED);

    const hashPassword: string = await bcrypt.hash(password, 8);

    await this.userService.createUser({
      username: username,
      email: email,
      password: hashPassword,
      online: false,
      parties: 0,
      partiesWon: 0,
      rating: 1500,
    });

    return this.login(email, password);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new CreateException(API_ERROR_CODES.USER_NOT_FOUND);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new CreateException(API_ERROR_CODES.USER_WRONG_PASSWORD);

    this.userService.setOnline({ email }, true);

    const token = generateAccessToken(user._id);
    return { token };
  }
}
