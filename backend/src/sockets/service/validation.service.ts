import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { movePropsType } from 'src/dto/validation.dto';
import { BLACK_FIGURES, FIGURES, WHITE_FIGURES } from '../../enum/constants';
import {
  checkDiagonalMove,
  checkSchemeAttack,
  checkVerticalAndHorizontalMove,
} from '../../helpers/validation';

export class ValidationService {
  private logger = new Logger();
  private initPos = 7;

  validationMove(props: any): boolean {
    const { figure, endPos, startPos } = props;

    const x: number = endPos[1] - startPos[1];
    const y: number = startPos[0] - endPos[0];
    const attackRow: number = this.initPos + y;
    const attackCol: number = this.initPos + x;

    props = {
      ...props,
      attackRow,
      attackCol,
      x,
      y,
    };

    this.basicСheck(props);

    switch (true) {
      case figure.toLowerCase() === FIGURES.BLACK_KING:
        return checkSchemeAttack(props);

      case figure.toLowerCase() === FIGURES.BLACK_QUEEN:
        return this.checkQueen(props);

      case figure.toLowerCase() === FIGURES.BLACK_BISHOP:
        return this.checkBishop(props);

      case figure.toLowerCase() === FIGURES.BLACK_KNIGHT:
        return checkSchemeAttack(props);

      case figure.toLowerCase() === FIGURES.BLACK_ROOK:
        return this.checkRook(props);

      case figure.toLowerCase() === FIGURES.BLACK_PAWN:
        return this.checkPawn(props);
    }
  }

  private basicСheck(props: movePropsType): boolean {
    const { client, figure, gameRoom, endPos } = props;

    const endFigure: string = gameRoom.board[endPos[0]][endPos[1]];

    const isWrongСoordinates =
      endPos[0] < 0 || endPos[0] > 7 || endPos[1] < 0 || endPos[1] > 7;

    const isFigureNotFound = figure === FIGURES.EMPTY;

    const isMoveToOwnFigure =
      (client.id === gameRoom.white.socket &&
        WHITE_FIGURES.includes(endFigure)) ||
      (client.id === gameRoom.black.socket &&
        BLACK_FIGURES.includes(endFigure));

    const isOpponentFigure =
      (client.id === gameRoom.white.socket && BLACK_FIGURES.includes(figure)) ||
      (client.id === gameRoom.black.socket && WHITE_FIGURES.includes(figure));

    if (isWrongСoordinates) throw new WsException('Wrong coordinates');
    if (isFigureNotFound) throw new WsException('Figure not found');
    if (isMoveToOwnFigure) throw new WsException('Move to own figure');
    if (isOpponentFigure) throw new WsException("Move opponent's figure");

    return false;
  }

  private checkQueen(props: movePropsType): boolean {
    const isSchemeAttack = checkSchemeAttack(props);
    const isFigureOnWay =
      checkDiagonalMove(props) || checkVerticalAndHorizontalMove(props);

    if (!isSchemeAttack)
      throw new WsException('A figure cannot move to this cell');

    if (isFigureOnWay)
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );

    return true;
  }

  private checkBishop(props: movePropsType): boolean {
    const isSchemeAttack = checkSchemeAttack(props);
    const isFigureOnWay = checkDiagonalMove(props);

    if (!isSchemeAttack)
      throw new WsException('A figure cannot move to this cell');

    if (isFigureOnWay)
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );

    return true;
  }

  private checkRook(props): boolean {
    const isSchemeAttack = checkSchemeAttack(props);
    const isFigureOnWay = checkVerticalAndHorizontalMove(props);

    if (!isSchemeAttack)
      throw new WsException('A figure cannot move to this cell');

    if (isFigureOnWay)
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );

    return true;
  }

  private checkPawn(props: movePropsType): boolean {
    const { gameRoom, figure, startPos, endPos, x, y } = props;

    const initPawnPos = figure === FIGURES.WHITE_PAWN ? 6 : 1;
    const step = figure === FIGURES.WHITE_PAWN ? 1 : -1;

    const isStep =
      Math.abs(y) === 1 &&
      x === 0 &&
      gameRoom.board[endPos[0]][endPos[1]] === FIGURES.EMPTY;

    const isDiagonal =
      Math.abs(x) === 1 &&
      y === step &&
      gameRoom.board[endPos[0]][endPos[1]] !== FIGURES.EMPTY;

    const isTwoSteps =
      startPos[0] === initPawnPos &&
      Math.abs(y) === 2 &&
      gameRoom.board[endPos[0]][endPos[1]] === FIGURES.EMPTY &&
      gameRoom.board[startPos[0] - step][endPos[1]] === FIGURES.EMPTY;

    return isStep || isDiagonal || isTwoSteps;
  }
}
