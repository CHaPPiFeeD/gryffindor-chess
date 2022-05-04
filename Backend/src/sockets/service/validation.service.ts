import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FIGURES, FIGURES_COLORS } from 'src/enum/constants';
import { gameType } from '../../dto/game.dto';
import {
  checkDiagonalMove,
  checkPawnMove,
  checkVerticalAndHorizontalMove,
} from '../../helpers/validation';

export class ValidationService {
  private logger = new Logger();
  private initPos = 7;

  // prettier-ignore
  private ATTACKS: string[][] = [
    ['bq',  '',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '',  '','bq'],
    [  '','bq',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '','bq',  ''],
    [  '',  '','bq',  '',  '',  '',   '', 'rq',   '',  '',  '',  '','bq',  '',  ''],
    [  '',  '',  '','bq',  '',  '',   '', 'rq',   '',  '',  '','bq',  '',  '',  ''],
    [  '',  '',  '',  '','bq',  '',   '', 'rq',   '',  '','bq',  '',  '',  '',  ''],
    [  '',  '',  '',  '',  '','bq',  'n', 'rq',  'n','bq',  '',  '',  '',  '',  ''],
    [  '',  '',  '',  '',  '', 'n','bkq','rkq','bkq', 'n',  '',  '',  '',  '',  ''],
    ['rq','rq','rq','rq','rq','rq','rkq',  '0','rk' , 'r', 'r', 'r', 'r', 'r', 'r'],
    [  '',  '',  '',  '',  '', 'n','bkq','rkq','bkq', 'n',  '',  '',  '',  '',  ''],
    [  '',  '',  '',  '',  '','bq',  'n', 'rq',  'n','bq',  '',  '',  '',  '',  ''],
    [  '',  '',  '',  '','bq',  '',   '', 'rq',   '',  '','bq',  '',  '',  '',  ''],
    [  '',  '',  '','bq',  '',  '',   '', 'rq',   '',  '',  '','bq',  '',  '',  ''],
    [  '',  '','bq',  '',  '',  '',   '', 'rq',   '',  '',  '',  '','bq',  '',  ''],
    [  '','bq',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '','bq',  ''],
    ['bq',  '',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '',  '','bq'],
  ];

  validationMove(
    client: Socket,
    figure: string,
    game: gameType,
    startPos: number[],
    endPos: number[],
  ): boolean {
    const board: string[][] = game.board;
    const x: number = endPos[1] - startPos[1];
    const y: number = startPos[0] - endPos[0];
    const row: number = this.initPos + (endPos[0] - startPos[0]);
    const column: number = this.initPos + (endPos[1] - startPos[1]);

    this.logger.debug(`x: ${x}`);
    this.logger.debug(`y: ${y}`);

    if (this.basicСheck(client, figure, game, endPos)) return false;

    switch (true) {
      case Object.is(figure.toLowerCase(), FIGURES.KING):
        return this.ATTACKS[row][column].includes(FIGURES.KING);

      case Object.is(figure.toLowerCase(), FIGURES.QUEEN):
        return this.ATTACKS[row][column].includes(FIGURES.QUEEN);

      case Object.is(figure.toLowerCase(), FIGURES.BISHOP):
        return this.ATTACKS[row][column].includes(FIGURES.BISHOP);

      case Object.is(figure.toLowerCase(), FIGURES.KNIGHT):
        return this.ATTACKS[row][column].includes(FIGURES.KNIGHT);

      case Object.is(figure.toLowerCase(), FIGURES.ROOK):
        return this.checkRook(board, startPos, row, column, x, y);

      case Object.is(figure.toLowerCase(), FIGURES.PAWN):
        return this.checkPawn(figure, board, startPos, endPos, x, y);

      default:
        break;
    }
  }

  checkBishop(
    board: string[][],
    startPos: number[],
    row: number,
    column: number,
    x: number,
    y: number,
  ): boolean {
    const isSchemeAttack = this.ATTACKS[row][column].includes(FIGURES.BISHOP);
    const isFigureOnWay = checkDiagonalMove(board, startPos, x, y);

    if (!isSchemeAttack) this.logger.error('A figure cannot move to this cell');
    if (isFigureOnWay)
      this.logger.error(
        'A figure on the path does not allow you to go to this cell',
      );

    return isSchemeAttack || isFigureOnWay;
  }

  basicСheck(
    client: Socket,
    figure: string,
    game: gameType,
    endPos: number[],
  ): boolean {
    const endFigure: string = game.board[endPos[0]][endPos[1]];

    const isFigureNotFound = Object.is(figure, '0');

    // prettier-ignore
    const isToOwnFigure =
      (Object.is(client.id, game.white.socket) &&
        'KQBNRP'.includes(endFigure)) ||
      (Object.is(client.id, game.black.socket) && 
        'kqbnrp'.includes(endFigure));

    const isOpponentFigure =
      (Object.is(client.id, game.white.socket) && 'kqbnrp'.includes(figure)) ||
      (Object.is(client.id, game.black.socket) && 'KQBNRP'.includes(figure));

    const figureIsKing = 'Kk'.includes(endFigure);

    if (isFigureNotFound) this.logger.error('Figure not found');
    if (isToOwnFigure) this.logger.error('Move to own figure');
    // eslint-disable-next-line prettier/prettier
    if (isOpponentFigure) this.logger.error('Move opponent\'s figure');
    if (figureIsKing) this.logger.error('Move to a king figure');

    return (
      isFigureNotFound || isToOwnFigure || isOpponentFigure || figureIsKing
    );
  }

  checkRook(
    board: string[][],
    startPos: number[],
    row: number,
    column: number,
    x: number,
    y: number,
  ): boolean {
    const isSchemeAttack: boolean = this.ATTACKS[row][column].includes(
      FIGURES.ROOK,
    );
    const isFigureOnWay = checkVerticalAndHorizontalMove(board, startPos, x, y);

    if (!isSchemeAttack) this.logger.error('A figure cannot move to this cell');
    if (isFigureOnWay)
      this.logger.error(
        'A figure on the path does not allow you to go to this cell',
      );

    return isSchemeAttack && !isFigureOnWay;
  }

  checkPawn(
    figure: string,
    board: string[][],
    startPos: number[],
    endPos: number[],
    x: number,
    y: number,
  ): boolean {
    return Object.is(figure, FIGURES_COLORS.WHITE.PAWN)
      ? checkPawnMove(board, startPos, endPos, x, y, 6, 1)
      : checkPawnMove(board, startPos, endPos, x, y, 1, -1);
  }
}
