import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
  // imports: [UserModule],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
