import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ObjectId } from 'mongoose';
import { GameService } from '../game/game.service';
import { ServerGateway } from '../server/server.gateway';
import { ISocket, QueueUserType } from '../../types';
import { UserService } from '../../modules/user/user.service';
import { WS_EVENTS } from '../../enums/constants';
import { COLORS } from '../../enums/constants';

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

    if (this.getUserInQueue(user.id))
      throw new WsException('You are already in line');

    const playerOne: QueueUserType = {
      userId: user.id,
      socket: client.id,
      name: user.username,
      color: data.color,
    };

    const desiredColors: string[] = this.getDesiredColors(playerOne.color);
    const playerTwo: QueueUserType = this.getUserByColor(desiredColors);

    if (!playerTwo) {
      this.queue.push(playerOne);
      this.serverGateway.server.in(playerOne.socket).socketsJoin('queue');
      this.serverGateway.server
        .in('queue')
        .emit(WS_EVENTS.QUEUE.GET_QUEUE, this.queue);
      return { isFind: false };
    } else {
      this.removeFromQueue(playerTwo.socket);
      this.serverGateway.server
        .in([playerOne.socket, playerTwo.socket])
        .socketsLeave('queue');
      this.gameService.startGame(playerOne, playerTwo);
      return { isFind: true };
    }
  }

  sendQueue(client: ISocket) {
    this.serverGateway.server
      .in(client.id)
      .emit(WS_EVENTS.QUEUE.GET_QUEUE, this.queue);
  }

  disconnect(socket: Socket) {
    const isInQueue = this.getUserBySocket(socket.id);
    if (!isInQueue) return;
    this.removeFromQueue(socket.id);
    this.serverGateway.server.in(socket.id).socketsLeave('queue');
    this.serverGateway.server
      .in('queue')
      .emit(WS_EVENTS.QUEUE.GET_QUEUE, this.queue);
  }

  private removeFromQueue(socketId: string) {
    this.queue.forEach((player, index) => {
      if (player.socket === socketId) this.queue.splice(index, 1);
    });
  }

  private getDesiredColors(colors: string[]): string[] {
    return colors.map((color) => {
      if (color === COLORS.WHITE) return COLORS.BLACK;
      if (color === COLORS.BLACK) return COLORS.WHITE;
    });
  }

  private getUserByColor(colors: string[]): QueueUserType {
    return this.queue.find((user) =>
      colors.some((color) => user.color.includes(color)),
    );
  }

  private getUserBySocket(socket: string): QueueUserType {
    return this.queue.find((obj) => obj.socket === socket);
  }

  private getUserInQueue(userId: ObjectId): QueueUserType {
    return this.queue.find((user) => user.userId === userId);
  }
}
