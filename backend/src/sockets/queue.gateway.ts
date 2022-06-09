import { Inject, Logger, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsAuthGuard } from 'src/guards/ws.auth.guard';
import { ISocket } from 'src/types';
import { QueueService } from './services/queue.service';

@WebSocketGateway({ cors: true })
export class QueueGateway {
  private logger = new Logger(QueueGateway.name);

  @Inject(QueueService)
  private queueService: QueueService;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('/queue/search')
  regToQueue(client: ISocket, data: { color: string[] }) {
    this.queueService.regToQueue(client, data);
  }

  @SubscribeMessage('/queue/leave')
  leave(client: Socket) {
    this.queueService.disconnect(client);
  }
}
