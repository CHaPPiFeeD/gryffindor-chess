import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  async getUser(client: Socket) {
    const payload = jwt.decode(client.handshake.auth?.token);
    this.logger.debug(payload);
    return await this.findOne({
      _id: payload['id'],
    });
  }

  async findOne(params) {
    return await this.userSchema.findOne({ ...params });
  }

  async createUser(params) {
    await this.userSchema.create({ ...params });
  }
}
