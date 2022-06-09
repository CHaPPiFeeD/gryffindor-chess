import { Inject, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { InitService } from './services/init.service';

@WebSocketGateway({ cors: true })
export class InitGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(InitGateway.name);

  @Inject(InitService)
  initService: InitService;

  handleConnection(client: Socket) {
    if (!client.handshake.auth.token) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
      return;
    }

    this.logger.log(`User connection: ${client.id}`);
    return client.id;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User disconnection: ${client.id}`);

    this.initService.handleDisconnect(client);
  }
}
