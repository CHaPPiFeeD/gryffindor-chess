import { Controller, Get, Inject } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRatingDto } from 'src/dto/rating.dto';
import { RatingService } from './rating.service';

@ApiTags('Rating')
@Controller('/api/rate')
export class RatingController {
  @Inject(RatingService)
  private ratingService: RatingService;

  @ApiResponse({
    status: 201,
    description: 'TOP10 players returned.',
    type: [UserRatingDto],
  })
  @Get('/top')
  getRate(): any {
    return this.ratingService.getUsersRating();
  }
}
