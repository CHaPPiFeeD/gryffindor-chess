import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ATTACKS,
  FIGURES,
  FIGURES_COLORS,
  PAWN_ATTACKS,
} from '../../enum/constants';
import { gameType } from '../../dto/game.dto';
import {
  checkDiagonalMove,
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
    const attacksRow: number = this.initPos + y;
    const attacksCol: number = this.initPos + x;

    if (this.basicСheck(client, figure, game, endPos)) return;

    this.logger.debug(figure);

    switch (true) {
      case figure.toLowerCase() === FIGURES.KING:
        return ATTACKS[attacksRow][attacksCol].includes(FIGURES.KING);

      case figure.toLowerCase() === FIGURES.QUEEN:
        return this.checkQueen(board, startPos, attacksRow, attacksCol, x, y);

      case figure.toLowerCase() === FIGURES.BISHOP:
        return this.checkBishop(board, startPos, attacksRow, attacksCol, x, y);

      case figure.toLowerCase() === FIGURES.KNIGHT:
        return ATTACKS[attacksRow][attacksCol].includes(FIGURES.KNIGHT);

      case figure.toLowerCase() === FIGURES.ROOK:
        return this.checkRook(board, startPos, attacksRow, attacksCol, x, y);

      case figure.toLowerCase() === FIGURES.PAWN:
        return this.checkPawn(figure, board, startPos, endPos, x, y);
    }
  }

  basicСheck(
    client: Socket,
    figure: string,
    game: gameType,
    endPos: number[],
  ): boolean {
    const endFigure: string = game.board[endPos[0]][endPos[1]];

    const isWrongСoordinates =
      endPos[0] < 0 || endPos[0] > 7 || endPos[1] < 0 || endPos[1] > 7;

    const isFigureNotFound = figure === FIGURES.EMPTY;

    const isToOwnFigure =
      (client.id === game.white.socket && 'KQBNRP'.includes(endFigure)) ||
      (client.id === game.black.socket && 'kqbnrp'.includes(endFigure));

    const isOpponentFigure =
      (client.id === game.white.socket && 'kqbnrp'.includes(figure)) ||
      (client.id === game.black.socket && 'KQBNRP'.includes(figure));

    const isFigureKing = 'Kk'.includes(endFigure);

    if (isWrongСoordinates)
      this.logger.error('The coordinates are out of the board');
    if (isFigureNotFound) this.logger.error('Figure not found');
    if (isToOwnFigure) this.logger.error('Move to own figure');
    if (isOpponentFigure) this.logger.error("Move opponent's figure");
    if (isFigureKing) this.logger.error('Move to a king figure');

    return (
      isWrongСoordinates ||
      isFigureNotFound ||
      isToOwnFigure ||
      isOpponentFigure ||
      isFigureKing
    );
  }

  checkQueen(
    board: string[][],
    startPos: number[],
    row: number,
    col: number,
    x: number,
    y: number,
  ) {
    const isSchemeAttack = ATTACKS[row][col].includes(FIGURES.QUEEN);

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
    col: number,
    x: number,
    y: number,
  ): boolean {
    const isSchemeAttack = ATTACKS[row][col].includes(FIGURES.BISHOP);

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
    col: number,
    x: number,
    y: number,
  ): boolean {
    const isSchemeAttack: boolean = ATTACKS[row][col].includes(FIGURES.ROOK);
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
    const row = y + 2;
    const col = y + 1;
    const initPawnPos = figure === FIGURES_COLORS.WHITE.PAWN ? 6 : 1;

    const isSchemeAttack = PAWN_ATTACKS[row][col].includes(figure);

    const isStep = Math.abs(y) === 1 && x === 0;

    const isDiagonal =
      Math.abs(x) === 1 && board[endPos[0]][endPos[1]] !== FIGURES.EMPTY;

    const isTwoSteps = startPos[0] === initPawnPos && Math.abs(y) === 2;

    return isSchemeAttack && (isStep || isDiagonal || isTwoSteps);
  }
}
