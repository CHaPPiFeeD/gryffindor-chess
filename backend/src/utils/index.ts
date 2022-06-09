import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateAccessToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
