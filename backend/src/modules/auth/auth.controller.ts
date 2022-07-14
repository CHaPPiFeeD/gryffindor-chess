import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDto, LoginDto, RegistrationDto } from '../../dto/auth.dto';
import { AuthResponseDto, AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @ApiResponse({
    status: 201,
    description:
      'Account creation successful. A confirmation link will be sent to your email.',
  })
  @Post('/create')
  create(@Body() body: CreateDto) {
    return this.authService.create(body.email);
  }

  @ApiResponse({ status: 201, description: 'Mail confirmed, data saved.' })
  @Post('/registration')
  registration(@Body() body: RegistrationDto) {
    return this.authService.registration(body);
  }

  @ApiResponse({
    status: 201,
    description: 'Login successfully. An access token is returned.',
    type: AuthResponseDto,
  })
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
