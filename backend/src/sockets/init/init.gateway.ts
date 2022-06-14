import { Inject, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ISocket } from 'src/types';
import { InitService } from './init.service';

@WebSocketGateway({ cors: true })
export class InitGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(InitGateway.name);

  @Inject(InitService)
  initService: InitService;

  handleConnection(client: ISocket) {
    return this.initService.handleConnect(client);
  }

  handleDisconnect(client: ISocket) {
    this.initService.handleDisconnect(client);
  }
}
