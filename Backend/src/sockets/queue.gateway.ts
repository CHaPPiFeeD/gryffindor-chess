import { Inject, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { regToQueueDto } from '../dto/queue.dto';
import { QueueService } from './service/queue.service';

@WebSocketGateway({ cors: true })
export class QueueGateway {
  private logger = new Logger(QueueGateway.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('/queue/search')
  regToQueue(client: Socket, data: regToQueueDto) {
    this.queueService.regToQueue(client, data);
  }
}
