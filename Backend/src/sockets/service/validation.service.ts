import { Logger } from '@nestjs/common';

export class ValidationService {
  private logger = new Logger();
  private initPos = 7;

  // prettier-ignore
  private ATTACKS: string[][] = [
    ['bq',  '',  '',  '',  '',  '',   '',  'rq',   '',  '',  '',  '',  '',  '','bq'],
    [  '','bq',  '',  '',  '',  '',   '',  'rq',   '',  '',  '',  '',  '','bq',  ''],
    [  '',  '','bq',  '',  '',  '',   '',  'rq',   '',  '',  '',  '','bq',  '',  ''],
    [  '',  '',  '','bq',  '',  '',   '',  'rq',   '',  '',  '','bq',  '',  '',  ''],
    [  '',  '',  '',  '','bq',  '',   '',  'rq',   '',  '','bq',  '',  '',  '',  ''],
    [  '',  '',  '',  '',  '','bq',  'n',  'rq',  'n','bq',  '',  '',  '',  '',  ''],
    [  '',  '',  '',  '',  '', 'n','bkq','rkqp','bkq', 'n',  '',  '',  '',  '',  ''],
    ['rq','rq','rq','rq','rq','rq','rkq',   '0','rk' , 'r', 'r', 'r', 'r', 'r', 'r'],
    [  '',  '',  '',  '',  '', 'n','bkq','rkqp','bkq', 'n',  '',  '',  '',  '',  ''],
    [  '',  '',  '',  '',  '','bq',  'n',  'rq',  'n','bq',  '',  '',  '',  '',  ''],
    [  '',  '',  '',  '','bq',  '',   '',  'rq',   '',  '','bq',  '',  '',  '',  ''],
    [  '',  '',  '','bq',  '',  '',   '',  'rq',   '',  '',  '','bq',  '',  '',  ''],
    [  '',  '','bq',  '',  '',  '',   '',  'rq',   '',  '',  '',  '','bq',  '',  ''],
    [  '','bq',  '',  '',  '',  '',   '',  'rq',   '',  '',  '',  '',  '','bq',  ''],
    ['bq',  '',  '',  '',  '',  '',   '',  'rq',   '',  '',  '',  '',  '',  '','bq'],
  ];

  validationMove(
    figure: string,
    board: string[][],
    startPos: number[],
    endPos: number[],
  ): boolean {
    const row = startPos[0] - endPos[0];
    const column = startPos[1] - endPos[1];

    this.logger.debug(row, column);

    switch (true) {
      case Object.is(figure, 'k'):
        return this.ATTACKS[this.initPos + row][this.initPos + column].includes('k');

      case Object.is(figure, 'q'):
        return this.ATTACKS[this.initPos + row][this.initPos + column].includes('q');

      case Object.is(figure, 'b'):
        return this.ATTACKS[this.initPos + row][this.initPos + column].includes('b');

      case Object.is(figure, 'n'):
        return this.ATTACKS[this.initPos + row][this.initPos + column].includes('n');

      case Object.is(figure, 'r'):
        return this.ATTACKS[this.initPos + row][this.initPos + column].includes('r');

      case Object.is(figure, 'p'):
        return this.ATTACKS[this.initPos + row][this.initPos + column].includes('p');

      default:
        break;
    }
  }
}
