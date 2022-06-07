import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  getUserBySocket,
  getFindsColors,
  getUserByColor,
} from '../../helpers/queue';
import { GameService } from './game.service';
import { ServerGateway } from '../server.gateway';
import { WsException } from '@nestjs/websockets';
import { QueueUserType, RegToQueueDataType } from 'src/types';

export class QueueService {
  private logger = new Logger(QueueService.name);
  private queue: QueueUserType[] = [];

  @Inject(GameService)
  gameService: GameService;

  @Inject(ServerGateway)
  serverGateway: ServerGateway;

  regToQueue(client: Socket, data: RegToQueueDataType) {
    const playerOne: QueueUserType = {
      socket: client.id,
      ...data,
    };

    if (getUserBySocket(this.queue, client.id))
      throw new WsException('You are already in line');

    const desiredColors: string[] = getFindsColors(playerOne.color);
    const playerTwo: QueueUserType = getUserByColor(this.queue, desiredColors);

    if (!playerTwo) {
      this.queue.push(playerOne);
    } else {
      const index: number = this.queue.findIndex(
        (player) => player.socket === playerTwo.socket,
      );

      if (index >= 0) this.queue.splice(index, 1);
      this.gameService.startGame(playerOne, playerTwo);
    }

    this.serverGateway.server.emit('/queue:get', this.queue);
  }

  disconnect = (socket: Socket) => {
    const isInQueue = getUserBySocket(this.queue, socket.id);

    if (!isInQueue) return;

    this.queue.forEach((value, index) => {
      if (value.socket === socket.id) this.queue.splice(index, 1);
    });

    this.serverGateway.server.emit('/queue:get', this.queue);
  };
}
