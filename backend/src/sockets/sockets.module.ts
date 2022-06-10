import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { GameGateway } from './game/game.gateway';
import { InitGateway } from './init/init.gateway';
import { QueueGateway } from './queue/queue.gateway';
import { ServerGateway } from './server/server.gateway';
import { BoardService } from './game/board.service';
import { GameService } from './game/game.service';
import { InitService } from './init/init.service';
import { QueueService } from './queue/queue.service';
import { ValidationService } from './game/validation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from 'src/schemas/game.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Party.name, schema: PartySchema }]),
  ],
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
