import { Inject, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { moveDto } from '../dto/game.dto';
import { GameService } from './service/game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  private logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: Server;

  @Inject(GameService)
  private gameService: GameService;

  @SubscribeMessage('/game/move')
  chessMuve(client: Socket, data: moveDto) {
    this.gameService.chessMove(data);
  }
}
