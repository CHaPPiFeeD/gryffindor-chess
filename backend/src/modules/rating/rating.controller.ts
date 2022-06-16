import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller()
export class RatingController {
  // @Inject(UserService)
  // private userService: UserService;

  @Get('/api/rate/top')
  getRate(): any {
    // return this.userService.getUsersRating();
  }
}
