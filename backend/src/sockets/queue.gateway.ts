import { Inject, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RegToQueueDataType } from 'src/types';
import { QueueService } from './services/queue.service';

@WebSocketGateway({ cors: true })
export class QueueGateway {
  private logger = new Logger(QueueGateway.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @SubscribeMessage('/queue/search')
  regToQueue(client: Socket, data: RegToQueueDataType) {
    this.queueService.regToQueue(client, data);
  }

  @SubscribeMessage('/queue/leave')
  leave(client: Socket) {
    this.queueService.disconnect(client);
  }
}
