import { movePropsType } from 'src/dto/validation.dto';
import { ATTACKS_SCHEME, FIGURES } from '../enum/constants';

export const checkVerticalAndHorizontalMove = (
  props: movePropsType,
): boolean => {
  const { gameRoom, startPos, x, y } = props;

  const row = startPos[0];
  const column = startPos[1];

  switch (true) {
    case x < 0 && y == 0: // left
      for (let i = 1; -i > x; i++) {
        const column = startPos[1] - i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y == 0: // right
      for (let i = 1; i < x; i++) {
        const column = startPos[1] + i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y > 0: //top
      for (let i = 1; -i > y; i++) {
        const row = startPos[0] - i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    case x == 0 && y < 0: // buttom
      for (let i = 1; i < y; i++) {
        const row = startPos[0] + i;
        if (gameRoom.board[row][column] !== FIGURES.EMPTY) return true;
      }
      break;

    default:
      break;
  }
};

export const checkDiagonalMove = (props: movePropsType): boolean => {
  const { gameRoom, startPos, x, y } = props;

  switch (true) {
    case x < 0 && y < 0: // top left
      for (let i = 1; -i > x && -i > y; i++) {
        const col = startPos[1] - i;
        const row = startPos[0] - i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y > 0: // top right
      for (let i = 1; i < x && -i > y; i++) {
        const col = startPos[1] + i;
        const row = startPos[0] - i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x < 0 && y < 0: // buttom left
      for (let i = 1; -i > x && i < y; i++) {
        const col = startPos[1] - i;
        const row = startPos[0] + i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;

    case x > 0 && y < 0: // buttom right
      for (let i = 1; i < x && i < y; i++) {
        const col = startPos[1] + i;
        const row = startPos[0] + i;
        if (gameRoom.board[row][col] !== FIGURES.EMPTY) return true;
      }
      break;
  }
};

export const checkCoordinates = (wayRow: number, wayCol: number) => {
  return wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8;
};

export const checkSchemeAttack = (props: movePropsType): boolean => {
  return ATTACKS_SCHEME[props.attackRow][props.attackCol].includes(
    props.figure.toLowerCase(),
  );
};
