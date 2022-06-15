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
    return await this.userSchema.findOne({ ...params });
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

  // async updateParties(id: ObjectId, isWin: boolean) {
  //   const user = await this.userSchema.findOne({ _id: id });

  //   const parties = user.parties + 1;
  //   const partiesWon = isWin ? user.partiesWon + 1 : user.partiesWon;
  //   const winRate = ((partiesWon / parties) * 100).toFixed(1);

  //   await this.userSchema.updateOne(
  //     { _id: id },
  //     { parties, partiesWon, winRate },
  //   );
  // }

  async getRate() {
    return await this.userSchema
      .find({ parties: { $gte: 10 } })
      .sort({ winRate: -1 })
      .limit(10);
  }
}
