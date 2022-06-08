import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateException } from 'src/exceptions/nocontent.exception';
import { generateAccessToken } from 'src/utils';
import { API_ERROR_CODES } from 'src/enums/errorsCode';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async register(username: string, email: string, password: string) {
    const candidate = await this.userSchema.findOne({ email });
    if (candidate)
      throw new CreateException(API_ERROR_CODES.USER_ALREADY_REGISTERED);

    const hashPassword: string = await bcrypt.hash(password, 8);

    await this.userSchema
      .create({
        username: username,
        email: email,
        password: hashPassword,
      })
      .then((v) => this.logger.log(v));
  }

  async login(email: string, password: string) {
    const user = await this.userSchema.findOne({ email });
    if (!user) throw new CreateException(API_ERROR_CODES.USER_NOT_FOUND);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new CreateException(API_ERROR_CODES.USER_WRONG_PASSWORD);

    const token = generateAccessToken(user._id);
    return { token };
  }
}
