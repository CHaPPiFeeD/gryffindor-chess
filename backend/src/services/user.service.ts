import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async findOne(params) {
    return await this.userSchema.findOne({ ...params });
  }

  async createUser(params) {
    await this.userSchema.create({ ...params });
  }
}
