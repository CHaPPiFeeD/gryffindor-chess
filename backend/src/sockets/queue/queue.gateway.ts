import { Inject, Logger, UseGuards, UsePipes } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SearchGameDto } from 'src/dto/gateway.dto';
import { WsAuthGuard } from 'src/guards/ws.auth.guard';
import { WsValidationPipe } from 'src/pipes/ws.validation.pipe';
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
  @UsePipes(new WsValidationPipe())
  regToQueue(client: ISocket, data: SearchGameDto) {
    return this.queueService.regToQueue(client, data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.QUEUE.LEAVE)
  leave(client: Socket) {
    this.queueService.disconnect(client);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.QUEUE.GET_QUEUE)
  getQueue(client: ISocket) {
    this.queueService.sendQueue(client);
  }
}
