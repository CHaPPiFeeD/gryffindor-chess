import { Inject, Logger, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsAuthGuard } from '../../guards/ws.auth.guard';
import { ISocket, MoveType } from '../../types';
import { WS_EVENTS } from '../../enums/constants';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  private logger = new Logger(GameGateway.name);

  @Inject(GameService)
  private gameService: GameService;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.GAME.MOVE)
  chessMuve(client: Socket, data: MoveType) {
    this.gameService.moveChess(client, data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.GAME.GET_GAME)
  getGame(client: ISocket) {
    this.gameService.sendGame(client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.GAME.DRAW)
  offerDraw(client: Socket, isDrawing: boolean) {
    this.gameService.draw(client, isDrawing);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WS_EVENTS.GAME.LEAVE)
  surrender(client: ISocket) {
    this.gameService.surrennder(client);
  }
}
