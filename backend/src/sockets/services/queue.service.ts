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
import { ISocket, QueueUserType } from 'src/types';
import { UserService } from 'src/services/user.service';

export class QueueService {
  private logger = new Logger(QueueService.name);
  private queue: QueueUserType[] = [];

  @Inject(GameService)
  private gameService: GameService;

  @Inject(ServerGateway)
  private serverGateway: ServerGateway;

  @Inject(UserService)
  private userService: UserService;

  async regToQueue(client: ISocket, data: { color: string[] }) {
    const user = await this.userService.findOne({ _id: client.user['id'] });

    const playerOne: QueueUserType = {
      socket: client.id,
      name: user.username,
      color: data.color,
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
