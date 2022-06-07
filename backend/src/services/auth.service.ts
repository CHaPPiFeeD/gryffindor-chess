import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async register(body) {
    console.log(body);
    const hashPassword: string = await bcrypt.hash(body.password, 8);

    await this.userSchema
      .create({
        username: body.username,
        login: body.login,
        password: hashPassword,
      })
      .then((e) => console.log(e));
  }
}
