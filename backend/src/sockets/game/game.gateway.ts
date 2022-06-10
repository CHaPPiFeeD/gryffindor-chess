import { Inject, Logger, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsAuthGuard } from 'src/guards/ws.auth.guard';
import { ISocket, MoveType } from '../../types';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  private logger = new Logger(GameGateway.name);

  @Inject(GameService)
  private gameService: GameService;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('/game/move:post')
  chessMuve(client: Socket, data: MoveType) {
    this.gameService.moveChess(client, data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('/game:get')
  getGame(client: ISocket) {
    this.gameService.sendGame(client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('/game/draw')
  offerDraw(client: Socket, isDrawing: boolean) {
    this.gameService.draw(client, isDrawing);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('/game/leave')
  surrender(client: ISocket) {
    this.gameService.disconnect(client, 'Your opponent has surrendered.');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('/game/reconnect')
  reconnect(client: ISocket) {
    this.gameService.reconnect(client);
  }
}
