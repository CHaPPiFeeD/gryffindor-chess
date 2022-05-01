import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  getUserBySocket,
  getFindsColors,
  getUserByColor,
} from '../../helpers/queue';
import { UserQueueDto, RegToQueueDto } from '../../dto/queue.dto';
import { GameService } from './game.service';

export class QueueService {
  private logger = new Logger(GameService.name);
  private queue: UserQueueDto[] = [];

  @Inject(GameService)
  private gameService: GameService;

  regToQueue(client: Socket, data: RegToQueueDto): string {
    const playerOne: UserQueueDto = {
      socket: client.id,
      ...data,
    };

    this.logger.log(playerOne);

    if (getUserBySocket(this.queue, playerOne)) return;
    const findColor: string[] = getFindsColors(playerOne.color);
    const playerTwo: UserQueueDto = getUserByColor(this.queue, findColor);

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
