import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/modules/auth/auth.service';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @Post('/api/auth/registration')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Post('/api/auth/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
