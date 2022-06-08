import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth.service';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @Post('/api/auth/register')
  register(@Body() body: RegisterDto) {
    this.authService.register(body.username, body.email, body.password);
  }

  @Post('/api/auth/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
