import { userQueueDto } from '../dto/queue.dto';
import { CHESS_COLORS } from '../enum/constants';

export const getFindsColors = (colors: string[]): string[] => {
  return colors.map((color) => {
    if (color === CHESS_COLORS.WHITE) return CHESS_COLORS.BLACK;
    if (color === CHESS_COLORS.BLACK) return CHESS_COLORS.WHITE;
  });
};

export const getUserByColor = (
  queue: userQueueDto[],
  colors: string[],
): userQueueDto => {
  return queue.find((user) =>
    colors.some((color) => user.color.includes(color)),
  );
};

export const getUserBySocket = (
  queue: userQueueDto[],
  data: userQueueDto,
): userQueueDto => {
  return queue.find((obj) => Object.is(obj.socket, data.socket));
};
