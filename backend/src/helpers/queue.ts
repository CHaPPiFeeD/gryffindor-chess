import { UserQueueDto } from '../dto/queue.dto';
import { COLORS } from '../enum/constants';

export const getFindsColors = (colors: string[]): string[] => {
  return colors.map((color) => {
    if (color === COLORS.WHITE) return COLORS.BLACK;
    if (color === COLORS.BLACK) return COLORS.WHITE;
  });
};

export const getUserByColor = (
  queue: UserQueueDto[],
  colors: string[],
): UserQueueDto => {
  return queue.find((user) =>
    colors.some((color) => user.color.includes(color)),
  );
};

export const getUserBySocket = (
  queue: UserQueueDto[],
  socket: string,
): UserQueueDto => {
  return queue.find((obj) => obj.socket === socket);
};
