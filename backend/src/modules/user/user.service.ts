import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async findOne(params) {
    return this.userSchema.findOne({ ...params });
  }

  async createUser(params) {
    await this.userSchema.create({ ...params });
  }

  async setOnline(filter, isOnline) {
    await this.userSchema.updateOne({ ...filter }, { online: isOnline });
  }

  async updateOne(filter, params) {
    await this.userSchema.updateOne({ ...filter }, { ...params });
  }

  async getUsersRating() {
    return this.userSchema
      .find({ parties: { $gte: 1 } })
      .sort({ rating: -1 })
      .limit(10);
  }
}
