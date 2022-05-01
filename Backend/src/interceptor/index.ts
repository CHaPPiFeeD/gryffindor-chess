import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from '../helpers';
import { map, Observable } from 'rxjs';

export class ResponseInterception implements NestInterceptor<Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Response>,
  ): Observable<Response> | Promise<Observable<Response>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    // const res = ctx.getResponse();
    return next.handle().pipe(
      map((value) => {
        return new Response({
          status_code: HttpStatus.OK,
          path: req.url,
          data: value,
        });
      }),
    );
  }
}
