import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ATTACKS, FIGURES, FIGURES_COLORS } from '../../enum/constants';
import { gameType } from '../../dto/game.dto';
import {
  checkDiagonalMove,
  checkPawnMove,
  checkVerticalAndHorizontalMove,
} from '../../helpers/validation';

export class ValidationService {
  private logger = new Logger();
  private initPos = 7;

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
    const row: number = this.initPos + y;
    const column: number = this.initPos + x;

    if (this.basicСheck(client, figure, game, endPos)) return;

    this.logger.debug(figure);

    switch (true) {
      case figure.toLowerCase() === FIGURES.KING:
        return ATTACKS[row][column].includes(FIGURES.KING);

      case figure.toLowerCase() === FIGURES.QUEEN:
        return this.checkQueen(board, startPos, row, column, x, y);

      case figure.toLowerCase() === FIGURES.BISHOP:
        return this.checkBishop(board, startPos, row, column, x, y);

      case figure.toLowerCase() === FIGURES.KNIGHT:
        return ATTACKS[row][column].includes(FIGURES.KNIGHT);

      case figure.toLowerCase() === FIGURES.ROOK:
        return this.checkRook(board, startPos, row, column, x, y);

      case figure.toLowerCase() === FIGURES.PAWN:
        return this.checkPawn(figure, board, startPos, endPos, x, y);

      default:
        break;
    }
  }

  basicСheck(
    client: Socket,
    figure: string,
    game: gameType,
    endPos: number[],
  ): boolean {
    const wrongСoordinates =
      endPos[0] < 0 || endPos[0] > 7 || endPos[1] < 0 || endPos[1] > 7;

    const isFigureNotFound = figure === FIGURES.EMPTY;

    const endFigure: string = game.board[endPos[0]][endPos[1]];

    const isToOwnFigure =
      (client.id === game.white.socket && 'KQBNRP'.includes(endFigure)) ||
      (client.id === game.black.socket && 'kqbnrp'.includes(endFigure));

    const isOpponentFigure =
      (client.id === game.white.socket && 'kqbnrp'.includes(figure)) ||
      (client.id === game.black.socket && 'KQBNRP'.includes(figure));

    const figureIsKing = 'Kk'.includes(endFigure);

    if (wrongСoordinates)
      this.logger.error('The coordinates are out of the board');
    if (isFigureNotFound) this.logger.error('Figure not found');
    if (isToOwnFigure) this.logger.error('Move to own figure');
    if (isOpponentFigure) this.logger.error("Move opponent's figure");
    if (figureIsKing) this.logger.error('Move to a king figure');

    return (
      wrongСoordinates ||
      isFigureNotFound ||
      isToOwnFigure ||
      isOpponentFigure ||
      figureIsKing
    );
  }

  checkQueen(
    board: string[][],
    startPos: number[],
    row: number,
    column: number,
    x: number,
    y: number,
  ) {
    const isSchemeAttack = ATTACKS[row][column].includes(FIGURES.QUEEN);
    const isFigureOnWay =
      checkDiagonalMove(board, startPos, x, y) ||
      checkVerticalAndHorizontalMove(board, startPos, x, y);

    if (!isSchemeAttack) this.logger.error('A figure cannot move to this cell');
    if (isFigureOnWay)
      this.logger.error(
        'A figure on the path does not allow you to go to this cell',
      );

    return isSchemeAttack && !isFigureOnWay;
  }

  checkBishop(
    board: string[][],
    startPos: number[],
    row: number,
    column: number,
    x: number,
    y: number,
  ): boolean {
    const isSchemeAttack = ATTACKS[row][column].includes(FIGURES.BISHOP);
    const isFigureOnWay = checkDiagonalMove(board, startPos, x, y);

    if (!isSchemeAttack) this.logger.error('A figure cannot move to this cell');
    if (isFigureOnWay)
      this.logger.error(
        'A figure on the path does not allow you to go to this cell',
      );

    return isSchemeAttack && !isFigureOnWay;
  }

  checkRook(
    board: string[][],
    startPos: number[],
    row: number,
    column: number,
    x: number,
    y: number,
  ): boolean {
    const isSchemeAttack: boolean = ATTACKS[row][column].includes(FIGURES.ROOK);
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
    return figure === FIGURES_COLORS.WHITE.PAWN
      ? checkPawnMove(board, startPos, endPos, x, y, 6, 1)
      : checkPawnMove(board, startPos, endPos, x, y, 1, -1);
  }
}
