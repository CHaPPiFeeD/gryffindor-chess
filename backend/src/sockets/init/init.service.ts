import { Inject, Logger } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { QueueService } from '../queue/queue.service';
import { UserService } from 'src/modules/user/user.service';
import { ISocket } from 'src/types';
import { JwtService } from 'src/modules/jwt/jwt.service';

export class InitService {
  private logger = new Logger(InitService.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @Inject(GameService)
  private gameService: GameService;

  @Inject(UserService)
  private userService: UserService;

  @Inject(JwtService)
  private jwtService: JwtService;

  async handleConnect(client: ISocket) {
    const accessToken = client.handshake.auth.token;

    if (!accessToken) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
      return;
    }

    const decoded = this.jwtService.verifyToken(accessToken);

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
    await this.gameService.connect(client);
    this.gameService.reconnect(client);
    this.logger.log(`User connection: ${client.id}`);
  }

  handleDisconnect(client: ISocket) {
    const accessToken = client.handshake.auth.token;
    if (!accessToken) return;

    const decoded = this.jwtService.verifyToken(accessToken);
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
