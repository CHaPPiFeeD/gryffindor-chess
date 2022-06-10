import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();

    const auth = client.handshake.auth;
    if (!auth.token) throw new WsException('Unauthorized');

    const decoded = jwt.verify(auth.token, process.env.JWT_SECRET);
    if (!decoded) throw new WsException('Unauthorized');

    client.user = decoded;
    console.log(decoded);
    return true;
  }
}
