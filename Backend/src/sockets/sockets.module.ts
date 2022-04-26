import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { InitGateway } from './init.gateway';
import { QueueGateway } from './queue.gateway';
import { GameService } from './service/game.service';

@Module({
  providers: [InitGateway, QueueGateway, GameGateway, GameService],
})
export class SocketsModule {}
