import { Injectable, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException('Bad request');
      }
      // console.debug(validationErrors);
      const errors = this.flattenValidationErrors(validationErrors);
      console.debug(errors);
      return new WsException(errors);
    };
  }
}
