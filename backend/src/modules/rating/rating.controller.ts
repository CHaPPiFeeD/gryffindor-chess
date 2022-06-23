import { Controller, Get, Inject } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { RatingService } from './rating.service';

@ApiTags('Rating')
@Controller()
export class RatingController {
  @Inject(RatingService)
  private ratingService: RatingService;

  @ApiResponse({
    status: 200,
    description: 'Player rating returned.',
    type: [User],
  })
  @Get('/api/rate/top')
  getRate(): any {
    return this.ratingService.getUsersRating();
  }
}
