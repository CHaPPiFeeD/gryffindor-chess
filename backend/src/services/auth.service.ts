import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateException } from 'src/exceptions/nocontent.exception';
import { generateAccessToken } from 'src/utils';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async register(username: string, email: string, password: string) {
    const candidate = await this.userSchema.findOne({ email });
    this.logger.debug(candidate);
    if (candidate) throw new CreateException('User already registered');

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
    this.logger.debug(user);
    if (!user) throw new CreateException('User not found');

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new CreateException('Wrong password');

    const token = generateAccessToken(user._id);
    return token;
  }
}
