import { Inject, Logger, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsAuthGuard } from 'src/guards/ws.auth.guard';
import { ISocket } from 'src/types';
import { WS_EVENTS } from '../constants';
import { QueueService } from './queue.service';

@WebSocketGateway({ cors: true })
export class QueueGateway {
  private logger = new Logger(QueueGateway.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.QUEUE.SEARCH)
  regToQueue(client: ISocket, data: { color: string[] }) {
    return this.queueService.regToQueue(client, data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.QUEUE.LEAVE)
  leave(client: Socket) {
    this.queueService.disconnect(client);
  }
}
