import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { QueueService } from './queue.service';

export class InitService {
  private logger = new Logger(InitService.name);

  @Inject(QueueService)
  private queueService: QueueService;

  handleDisconnect(client: Socket) {
    this.queueService.removePlayerFromQueue(client);
  }
}
