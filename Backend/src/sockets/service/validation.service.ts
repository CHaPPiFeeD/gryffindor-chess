import { Logger } from '@nestjs/common';
import { FIGURES } from 'src/enum/constants';

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
    figure: string,
    board: string[][],
    startPos: number[],
    endPos: number[],
  ): boolean {
    const x = startPos[0] - endPos[0];
    const y = startPos[1] - endPos[1];
    const row = this.initPos + x;
    const column = this.initPos + y;

    this.logger.debug(`row: ${row}`, `column: ${column}`);

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
        return this.ATTACKS[row][column].includes(FIGURES.ROOK);

      case Object.is(figure.toLowerCase(), FIGURES.PAWN):
        return this.checkPawn(figure, board, startPos, endPos, x, y);

      default:
        break;
    }
  }

  checkPawn(
    figure: string,
    board: string[][],
    startPos: number[],
    endPos: number[],
    x: number,
    y: number,
  ): boolean {
    return Object.is(figure, 'P')
      ? this.checkPawnMove(board, startPos, endPos, x, y, 6, 1)
      : this.checkPawnMove(board, startPos, endPos, x, y, 1, -1);
  }

  checkPawnMove(
    board: string[][],
    startPos: number[],
    endPos: number[],
    x: number,
    y: number,
    initPawnPos: number,
    step: number,
  ): boolean {
    // step
    const a = Object.is(x, step) && Object.is(y, 0);

    // diagonal
    const b =
      Object.is(Math.abs(y), 1) &&
      Object.is(x, step) &&
      !Object.is(board[endPos[0]][endPos[1]], '0');

    // two steps
    const c =
      Object.is(startPos[0], initPawnPos) &&
      Object.is(x, step + step) &&
      Object.is(y, 0);

    return a || b || c;
  }
}
