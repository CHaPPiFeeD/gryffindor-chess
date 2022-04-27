import { Inject, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CHESS_COLORS } from '../enum/constants';
import { regToQueueDto, userQueueDto } from '../dto/queue.dto';
import { GameService } from './service/game.service';

@WebSocketGateway({ cors: true })
export class QueueGateway {
  private queue: userQueueDto[] = [];
  private logger = new Logger(QueueGateway.name);

  @Inject(GameService)
  private gameService: GameService;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('/queue/search')
  registerToQueue(client: Socket, payload: regToQueueDto): void {
    const playerOne: userQueueDto = {
      socket: client.id,
      ...payload,
    };

    if (this.getUserBySocket(playerOne)) return;
    const findColor: string[] = this.getFindsColors(playerOne.color);
    const playerTwo: userQueueDto = this.getUserByColor(findColor);

    if (!playerTwo) {
      this.queue.push(playerOne);
    } else {
      const index: number = this.queue.findIndex((obj) =>
        Object.is(obj.socket, playerTwo.socket),
      );

      if (index >= 0) {
        this.queue.splice(index, 1);
      }

      this.gameService.startGame(playerOne, playerTwo, (room) => {
        this.server.in([playerOne.socket, playerTwo.socket]).socketsJoin(room);
        this.server.emit('/game/start'); //
      });
    }
  }

  getFindsColors(colors: string[]): string[] {
    return colors.map((color) => {
      if (color === CHESS_COLORS.WHITE) return CHESS_COLORS.BLACK;
      if (color === CHESS_COLORS.BLACK) return CHESS_COLORS.WHITE;
    });
  }

  getUserByColor(colors: string[]): userQueueDto {
    return this.queue.find((user) =>
      colors.some((color) => user.color.includes(color)),
    );
  }

  getUserBySocket(data: userQueueDto): userQueueDto {
    return this.queue.find((obj) => Object.is(obj.socket, data.socket));
  }
}
