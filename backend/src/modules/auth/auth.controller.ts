import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthResponseDto, AuthService } from 'src/modules/auth/auth.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @ApiResponse({
    status: 200,
    description: 'Registration successful. An access token is returned.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @Post('/api/auth/registration')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @ApiResponse({
    status: 200,
    description: 'Login successfully. An access token is returned.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @Post('/api/auth/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
