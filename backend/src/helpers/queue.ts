import { ObjectId } from 'mongoose';
import { QueueUserType } from 'src/types';
import { COLORS } from '../enums/constants';

export const getFindsColors = (colors: string[]): string[] => {
  return colors.map((color) => {
    if (color === COLORS.WHITE) return COLORS.BLACK;
    if (color === COLORS.BLACK) return COLORS.WHITE;
  });
};

export const getUserByColor = (
  queue: QueueUserType[],
  colors: string[],
): QueueUserType => {
  return queue.find((user) =>
    colors.some((color) => user.color.includes(color)),
  );
};

export const getUserBySocket = (
  queue: QueueUserType[],
  socket: string,
): QueueUserType => {
  return queue.find((obj) => obj.socket === socket);
};

export const checkUserInQueue = (
  queue: QueueUserType[],
  userId: ObjectId,
): QueueUserType => {
  return queue.find((user) => user.userId === userId);
};
