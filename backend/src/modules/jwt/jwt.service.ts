import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

@Injectable()
export class JwtService {
  private readonly jwtSecret = process.env.JWT_SECRET;

  generateAccessToken(payload: { id: Types.ObjectId }) {
    return jwt.sign(payload, this.jwtSecret);
  }

  generateRegistrationToken(payload: { email: string }) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: 60 * 60 * 24, // 24 hours
    });
  }

  verifyToken(token) {
    return jwt.verify(token, this.jwtSecret);
  }
}
