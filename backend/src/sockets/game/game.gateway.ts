import { Inject, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ISocket, MoveType } from '../../types';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  private logger = new Logger(GameGateway.name);

  @Inject(GameService)
  private gameService: GameService;

  @SubscribeMessage('/game/move:post')
  chessMuve(client: Socket, data: MoveType) {
    this.gameService.moveChess(client, data);
  }

  @SubscribeMessage('/game:get')
  getGame(client: ISocket) {
    this.gameService.sendGame(client.id);
  }

  @SubscribeMessage('/game/draw')
  offerDraw(client: Socket, isDrawing: boolean) {
    this.gameService.draw(client, isDrawing);
  }

  @SubscribeMessage('/game/leave')
  surrender(client: ISocket) {
    this.gameService.disconnect(client, 'Your opponent has surrendered.');
  }

  @SubscribeMessage('/game/reconnect')
  reconnect(client: ISocket) {
    this.gameService.reconnect(client);
  }
}
