import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ATTACKS,
  BLACK_FIGURES,
  FIGURES,
  FIGURES_COLORS,
  PAWN_ATTACKS,
  WHITE_FIGURES,
} from '../../enum/constants';
import { gameType } from '../../dto/game.dto';
import {
  checkDiagonalMove,
  checkVerticalAndHorizontalMove,
} from '../../helpers/validation';
import { movePropsType } from 'src/dto/validation.dto';

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
    const x: number = endPos[1] - startPos[1];
    const y: number = startPos[0] - endPos[0];
    const attacksRow: number = this.initPos + y;
    const attacksCol: number = this.initPos + x;

    const props: movePropsType = {
      client,
      figure,
      game,
      board: game.board,
      startPos,
      endPos,
      row: attacksRow,
      col: attacksCol,
      x,
      y,
    };

    if (this.basicСheck(props)) return;

    this.logger.debug(figure);

    switch (true) {
      case figure.toLowerCase() === FIGURES.KING:
        return ATTACKS[attacksRow][attacksCol].includes(FIGURES.KING);

      case figure.toLowerCase() === FIGURES.QUEEN:
        return this.checkQueen(props);

      case figure.toLowerCase() === FIGURES.BISHOP:
        return this.checkBishop(props);

      case figure.toLowerCase() === FIGURES.KNIGHT:
        return ATTACKS[attacksRow][attacksCol].includes(FIGURES.KNIGHT);

      case figure.toLowerCase() === FIGURES.ROOK:
        return this.checkRook(props);

      case figure.toLowerCase() === FIGURES.PAWN:
        return this.checkPawn(props);
    }
  }

  basicСheck(props): boolean {
    const { client, figure, game, endPos } = props;

    const endFigure: string = game.board[endPos[0]][endPos[1]];

    const isWrongСoordinates =
      endPos[0] < 0 || endPos[0] > 7 || endPos[1] < 0 || endPos[1] > 7;

    const isFigureNotFound = figure === FIGURES.EMPTY;

    const isToOwnFigure =
      (client.id === game.white.socket && WHITE_FIGURES.includes(endFigure)) ||
      (client.id === game.black.socket && BLACK_FIGURES.includes(endFigure));

    const isOpponentFigure =
      (client.id === game.white.socket && BLACK_FIGURES.includes(figure)) ||
      (client.id === game.black.socket && WHITE_FIGURES.includes(figure));

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

  checkQueen(props) {
    const { board, startPos, row, col, x, y } = props;

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

  checkBishop(props): boolean {
    const { board, startPos, row, col, x, y } = props;

    const isSchemeAttack = ATTACKS[row][col].includes(FIGURES.BISHOP);

    const isFigureOnWay = checkDiagonalMove(board, startPos, x, y);

    if (!isSchemeAttack) this.logger.error('A figure cannot move to this cell');
    if (isFigureOnWay)
      this.logger.error(
        'A figure on the path does not allow you to go to this cell',
      );

    return isSchemeAttack && !isFigureOnWay;
  }

  checkRook(props): boolean {
    const { board, startPos, row, col, x, y } = props;

    const isSchemeAttack: boolean = ATTACKS[row][col].includes(FIGURES.ROOK);
    const isFigureOnWay = checkVerticalAndHorizontalMove(board, startPos, x, y);

    if (!isSchemeAttack) this.logger.error('A figure cannot move to this cell');
    if (isFigureOnWay)
      this.logger.error(
        'A figure on the path does not allow you to go to this cell',
      );

    return isSchemeAttack && !isFigureOnWay;
  }

  checkPawn(props): boolean {
    const { figure, board, startPos, endPos, x, y } = props;

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
