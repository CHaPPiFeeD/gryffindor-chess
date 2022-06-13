import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

  async updateParties(id: ObjectId, isWin: boolean) {
    const user = await this.userSchema.findOne({ _id: id });

    console.log(user);

    const parties = user.parties + 1;
    const partiesWon = isWin ? user.partiesWon + 1 : user.partiesWon;

    console.log(parties);
    console.log(partiesWon);

    await this.userSchema.updateOne({ _id: id }, { parties, partiesWon });
  }
}
