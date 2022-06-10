import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  getUserBySocket,
  getFindsColors,
  getUserByColor,
  checkUserInQueue,
} from '../../helpers/queue';
import { GameService } from '../game/game.service';
import { ServerGateway } from '../server/server.gateway';
import { WsException } from '@nestjs/websockets';
import { ISocket, QueueUserType } from 'src/types';
import { UserService } from 'src/modules/user/user.service';
import { WS_EVENTS } from '../constants';

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

    if (checkUserInQueue(this.queue, user.id))
      throw new WsException('You are already in line');

    // this.serverGateway.server.emit('/queue/search');

    const playerOne: QueueUserType = {
      userId: user.id,
      socket: client.id,
      name: user.username,
      color: data.color,
    };

    const desiredColors: string[] = getFindsColors(playerOne.color);
    const playerTwo: QueueUserType = getUserByColor(this.queue, desiredColors);

    if (!playerTwo) {
      this.queue.push(playerOne);
      this.serverGateway.server.emit(WS_EVENTS.QUEUE.GET_QUEUE, this.queue);
    } else {
      const index: number = this.queue.findIndex(
        (player) => player.socket === playerTwo.socket,
      );

      if (index >= 0) this.queue.splice(index, 1);
      this.gameService.startGame(playerOne, playerTwo);
    }
  }

  disconnect = (socket: Socket) => {
    const isInQueue = getUserBySocket(this.queue, socket.id);

    if (!isInQueue) return;

    this.queue.forEach((value, index) => {
      if (value.socket === socket.id) this.queue.splice(index, 1);
    });

    this.serverGateway.server.emit(WS_EVENTS.QUEUE.GET_QUEUE, this.queue);
  };
}
