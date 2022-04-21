import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class InitGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(InitGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`User connection: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User disconnection: ${client.id}`);
  }
}
