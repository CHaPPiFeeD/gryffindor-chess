import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, registrationDto } from 'src/dto/auth.dto';
import { AuthResponseDto, AuthService } from 'src/modules/auth/auth.service';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  // @ApiResponse({
  //   status: 200,
  //   description: 'Registration successful. An access token is returned.',
  //   type: AuthResponseDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request.',
  // })
  @Post('/create')
  create(@Body() body: { email: string }) {
    return this.authService.create(body.email);
  }

  @Post('/registration')
  registration(@Body() body: registrationDto) {
    return this.authService.registration(body);
  }

  // @ApiResponse({
  //   status: 200,
  //   description: 'Login successfully. An access token is returned.',
  //   type: AuthResponseDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request.',
  // })
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
