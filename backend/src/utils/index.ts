import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateAccessToken = (id: Types.ObjectId) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};
