import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/auth.dto';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async findOne(params) {
    return this.userSchema.findOne({ ...params });
  }

  async createUser(userData: RegisterDto) {
    await this.userSchema.create({
      ...userData,
      isVerified: false,
      online: false,
      parties: 0,
      partiesWon: 0,
      rating: 1500,
    });
  }

  async setOnline(filter, isOnline) {
    await this.userSchema.updateOne({ ...filter }, { online: isOnline });
  }

  async updateOne(filter, params) {
    await this.userSchema.updateOne({ ...filter }, { ...params });
  }
}
