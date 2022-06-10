import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { WsAuthGuard } from 'src/guards/ws.auth.guard';
import { ISocket } from 'src/types';
import { InitService } from './init.service';

@WebSocketGateway({ cors: true })
export class InitGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(InitGateway.name);

  @Inject(InitService)
  initService: InitService;

  // @UseGuards(WsAuthGuard)
  handleConnection(client: ISocket) {
    return this.initService.handleConnect(client);
  }

  handleDisconnect(client: ISocket) {
    this.initService.handleDisconnect(client);
  }
}
