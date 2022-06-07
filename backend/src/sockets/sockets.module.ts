import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { InitGateway } from './init.gateway';
import { QueueGateway } from './queue.gateway';
import { ServerGateway } from './server.gateway';
import { BoardService } from './services/board.service';
import { GameService } from './services/game.service';
import { InitService } from './services/init.service';
import { QueueService } from './services/queue.service';
import { ValidationService } from './services/validation.service';

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
