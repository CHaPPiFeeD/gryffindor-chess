import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  getUserBySocket,
  getFindsColors,
  getUserByColor,
} from '../../helpers/queue';
import { userQueueDto, regToQueueDto } from '../../dto/queue.dto';
import { GameService } from './game.service';

export class QueueService {
  private logger = new Logger(GameService.name);
  private queue: userQueueDto[] = [];

  @Inject(GameService)
  private gameService: GameService;

  regToQueue(client: Socket, data: regToQueueDto): string {
    const playerOne: userQueueDto = {
      socket: client.id,
      ...data,
    };

    this.logger.debug(playerOne);

    if (getUserBySocket(this.queue, playerOne)) return;
    const findColor: string[] = getFindsColors(playerOne.color);
    const playerTwo: userQueueDto = getUserByColor(this.queue, findColor);

    if (!playerTwo) {
      this.queue.push(playerOne);
    } else {
      const index: number = this.queue.findIndex((obj) =>
        Object.is(obj.socket, playerTwo.socket),
      );

      if (index >= 0) {
        this.queue.splice(index, 1);
      }

      this.gameService.startGame(playerOne, playerTwo);
    }
  }
}
