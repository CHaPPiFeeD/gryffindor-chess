import { Controller, Get, Inject } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller()
export class RatingController {
  @Inject(RatingService)
  private ratingService: RatingService;

  @Get('/api/rate/top')
  getRate(): any {
    return this.ratingService.getUsersRating();
  }
}
