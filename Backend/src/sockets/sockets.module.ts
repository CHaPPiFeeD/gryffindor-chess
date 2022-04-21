import { Module } from '@nestjs/common';
import { InitGateway } from './init.gateway';
import { QueueGateway } from './queue.gateway';

@Module({
  providers: [InitGateway, QueueGateway],
})
export class SocketsModule {}
