import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @Post('/api/auth/register')
  register(@Body() body) {
    this.authService.register(body);
  }
}
