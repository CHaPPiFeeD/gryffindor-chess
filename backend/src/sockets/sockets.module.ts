import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { InitGateway } from './init.gateway';
import { QueueGateway } from './queue.gateway';
import { ServerGateway } from './server.gateway';
import { BoardService } from './service/board.service';
import { GameService } from './service/game.service';
import { InitService } from './service/init.service';
import { QueueService } from './service/queue.service';
import { ValidationService } from './service/validation.service';

@Module({
  providers: [
    InitGateway,
    InitService,
    ServerGateway,
    QueueGateway,
    QueueService,
    GameGateway,
    GameService,
    ValidationService,
    BoardService,
  ],
  exports: [InitGateway, QueueGateway, QueueService, GameGateway, GameService],
})
export class SocketsModule {}
