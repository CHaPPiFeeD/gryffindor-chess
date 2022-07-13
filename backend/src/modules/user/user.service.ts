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

  async registration(email: string, userData: { username: string, password: string }) {
    await this.updateOne({ email }, {
      ...userData,
      isVerified: true,
      online: false,
      parties: 0,
      partiesWon: 0,
      rating: 1500,
    })
  }

  async create(email: string) {
    await this.userSchema.create({ email, isVerified: false });
  }

  async setOnline(filter, isOnline) {
    await this.userSchema.updateOne({ ...filter }, { online: isOnline });
  }

  async updateOne(filter, params) {
    await this.userSchema.updateOne({ ...filter }, { ...params });
  }
}
