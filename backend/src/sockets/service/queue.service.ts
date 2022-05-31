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
  private logger = new Logger(QueueService.name);
  private queue: UserQueueDto[] = [];

  @Inject(GameService)
  gameService: GameService;

  regToQueue(client: Socket, data: RegToQueueDto) {
    const playerOne: UserQueueDto = {
      socket: client.id,
      ...data,
    };

    if (getUserBySocket(this.queue, client.id)) {
      this.logger.error('You are already in line');
      return;
    }

    this.logger.log(playerOne);

    const desiredColors: string[] = getFindsColors(playerOne.color);
    const playerTwo: UserQueueDto = getUserByColor(this.queue, desiredColors);

    if (!playerTwo) {
      this.queue.push(playerOne);
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
  };
}
