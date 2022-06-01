import { Inject, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RegToQueueDto } from '../dto/queue.dto';
import { QueueService } from './service/queue.service';

@WebSocketGateway({ cors: true })
export class QueueGateway {
  private logger = new Logger(QueueGateway.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @SubscribeMessage('/queue/search')
  regToQueue(client: Socket, data: RegToQueueDto) {
    this.queueService.regToQueue(client, data);
  }

  @SubscribeMessage('/queue/leave')
  leave(client: Socket) {
    this.queueService.disconnect(client);
  }
}
