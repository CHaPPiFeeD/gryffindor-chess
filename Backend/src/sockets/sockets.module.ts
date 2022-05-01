import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { InitGateway } from './init.gateway';
import { QueueGateway } from './queue.gateway';
import { GameService } from './service/game.service';
import { QueueService } from './service/queue.service';

@Module({
  providers: [
    InitGateway,
    QueueGateway,
    QueueService,
    GameGateway,
    GameService,
  ],
  exports: [InitGateway, QueueGateway, QueueService, GameGateway, GameService],
})
export class SocketsModule {}
