import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { JwtService } from 'src/modules/jwt/jwt.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();

    const auth = client.handshake.auth;
    if (!auth.token) throw new WsException('Unauthorized');

    const decoded = this.jwtService.verifyToken(auth.token);
    if (!decoded) throw new WsException('Unauthorized');

    client.user = decoded;
    return true;
  }
}
