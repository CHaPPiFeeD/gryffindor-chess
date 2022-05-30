import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
import { QueueService } from './queue.service';

export class InitService {
  private logger = new Logger(InitService.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @Inject(GameService)
  private gameService: GameService;

  handleDisconnect(client: Socket) {
    this.queueService.disconnect(client);
    this.gameService.disconnect(client);
  }
}
