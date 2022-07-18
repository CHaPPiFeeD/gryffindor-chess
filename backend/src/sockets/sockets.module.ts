import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { GameGateway } from './game/game.gateway';
import { InitGateway } from './init/init.gateway';
import { QueueGateway } from './queue/queue.gateway';
import { ServerGateway } from './server/server.gateway';
import { FogBoardService } from './game/fog-board.service';
import { GameService } from './game/game.service';
import { InitService } from './init/init.service';
import { QueueService } from './queue/queue.service';
import { ValidationService } from './game/validation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from '../schemas/party.schema';
import { PartyModule } from '../modules/party/party.module';
import { JwtModule } from '../modules/jwt/jwt.module';
import { BoardService } from './game/board.service';
import { StandartValidationService } from './game/standart-validation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Party.name, schema: PartySchema }]),
    UserModule,
    PartyModule,
    JwtModule,
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
    FogBoardService,
    BoardService,
    StandartValidationService,
  ],
  exports: [InitGateway, QueueGateway, QueueService, GameGateway, GameService],
})
export class SocketsModule {}
