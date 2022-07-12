import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

@Injectable()
export class JwtService {
  generateAccessToken(payload: { id: Types.ObjectId }) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, process.env.JWT_SECRET);
  }
}
