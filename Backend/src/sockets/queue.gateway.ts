import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { regToQueueDto, userQueueDto } from './dto/queue.dto';

@WebSocketGateway()
export class QueueGateway {
  private queue = [];
  private logger = new Logger(QueueGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('/search/room')
  registerToQueue(client: Socket, payload: regToQueueDto) {
    const data: userQueueDto = {
      socket: client.id,
      ...payload,
    };

    const findColor: string[] = this.getFindsColors(data.color);

    const anotherPlayer: userQueueDto = this.getUserByColor(findColor);

    if (!anotherPlayer) {
      if (this.getUserBySocket(data)) return;
      this.queue.push(data);
    } else {
      const index = this.queue.findIndex((obj) =>
        Object.is(obj.socket, anotherPlayer.socket),
      );
      if (index >= 0) {
        this.queue.splice(index, 1);
      }
    }

    this.logger.debug(JSON.stringify(this.queue));
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
