import { Inject, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GameService } from '../game/game.service';
import { QueueService } from '../queue/queue.service';
import { UserService } from '../../modules/user/user.service';
import { ISocket } from '../../types';

export class InitService {
  private logger = new Logger(InitService.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @Inject(GameService)
  private gameService: GameService;

  @Inject(UserService)
  private userService: UserService;

  async handleConnect(client: ISocket) {
    const token = client.handshake.auth.token;

    if (!token) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
      return;
    }

    const user = await this.userService.findOne({ _id: decoded['id'] });

    if (!user) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
      return;
    }

    client.user = decoded;
    await this.userService.setOnline({ _id: decoded['id'] }, true);
    this.gameService.connect(client);
    this.gameService.reconnect(client);
    this.logger.log(`User connection: ${client.id}`);
  }

  handleDisconnect(client: ISocket) {
    const auth = client.handshake.auth;
    if (!auth.token) return;

    const decoded = jwt.verify(auth.token, process.env.JWT_SECRET);
    if (!decoded) return;

    client.user = decoded;
    this.userService.setOnline({ _id: decoded['id'] }, false);
    this.queueService.disconnect(client);

    this.gameService.disconnect(
      client,
      'Opponent has disconnected from the game.',
    );

    this.logger.log(`User disconnection: ${client.id}`);
  }
}
