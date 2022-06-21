import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from '../../schemas/party.schema';
import { RatingModule } from '../rating/rating.module';
import { UserModule } from '../user/user.module';
import { PartyService } from './party.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Party.name, schema: PartySchema }]),
    UserModule,
    RatingModule,
  ],
  providers: [PartyService],
  exports: [PartyService],
})
export class PartyModule {}
