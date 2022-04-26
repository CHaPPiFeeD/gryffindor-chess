import { Inject, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { regToQueueDto, userQueueDto } from './dto/queue.dto';
import { GameService } from './service/game.service';
// import { GameGateway } from './game.gateway';

@WebSocketGateway()
export class QueueGateway {
  private queue = [];
  private logger = new Logger(QueueGateway.name);

  @Inject(GameService)
  private gameService: GameService;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('/search/room')
  registerToQueue(client: Socket, payload: regToQueueDto) {
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
      const index = this.queue.findIndex((obj) =>
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

    this.logger.log('---queue---', JSON.stringify(this.queue));
  }

  getFindsColors(colors: string[]): string[] {
    return colors.map((color) => {
      if (color === 'white') return 'black';
      if (color === 'black') return 'white';
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
