import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  @Inject(UserService)
  private userService: UserService;

  @Get('/api/user/rate')
  getRate() {
    return this.userService.getRate();
  }
}
