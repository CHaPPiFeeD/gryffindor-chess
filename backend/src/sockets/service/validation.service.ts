import { Inject, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { colorsType, movePropsType } from 'src/dto/validation.dto';
import {
  BLACK_FIGURES,
  COLORS,
  FIGURES,
  WHITE_FIGURES,
} from '../../enum/constants';
import {
  checkDiagonalMove,
  // checkKingCastle,
  checkSchemeAttack,
  checkVerticalAndHorizontalMove,
} from '../../helpers/validation';
import { ServerGateway } from '../server.gateway';

export class ValidationService {
  private logger = new Logger();
  private initPos = 7;

  @Inject(ServerGateway)
  serverGateway: ServerGateway;

  validationMove(props: movePropsType) {
    const { gameRoom, figure, endPos, startPos, clientColor } = props;

    const x: number = endPos[1] - startPos[1];
    const y: number = endPos[0] - startPos[0];
    const attackRow: number = this.initPos + y;
    const attackCol: number = this.initPos + x;

    this.basicСheck(props);

    const endFigure: string = gameRoom.board[endPos[0]][endPos[1]];

    props = {
      ...props,
      attackRow,
      attackCol,
      x,
      y,
      endFigure,
    };

    switch (true) {
      case figure.toLowerCase() === FIGURES.BLACK_KING:
        this.checkKing(props);
        break;

      case figure.toLowerCase() === FIGURES.BLACK_QUEEN:
        this.checkQueen(props);
        break;

      case figure.toLowerCase() === FIGURES.BLACK_BISHOP:
        this.checkBishop(props);
        break;

      case figure.toLowerCase() === FIGURES.BLACK_KNIGHT:
        checkSchemeAttack(props);
        break;

      case figure.toLowerCase() === FIGURES.BLACK_ROOK:
        this.checkRook(props);
        break;

      case figure.toLowerCase() === FIGURES.BLACK_PAWN:
        this.checkPawn(props);
        break;
    }

    this.checkEndGame({ ...props, clientColor, endFigure });
  }

  checkMoveQueue = (props): colorsType[] => {
    const { client, gameRoom } = props;

    let clientColor, nextMove;

    if (client.id === gameRoom.white.socket) {
      clientColor = COLORS.WHITE;
      nextMove = COLORS.BLACK;
    }

    if (client.id === gameRoom.black.socket) {
      clientColor = COLORS.BLACK;
      nextMove = COLORS.WHITE;
    }

    if (clientColor !== gameRoom.moveQueue)
      throw new WsException("Opponent's move order");

    return [clientColor, nextMove];
  };

  private basicСheck(props: movePropsType) {
    const { client, figure, gameRoom, endPos } = props;

    const isWrongСoordinates =
      endPos[0] < 0 || endPos[0] > 7 || endPos[1] < 0 || endPos[1] > 7;

    if (isWrongСoordinates) throw new WsException('Wrong coordinates');
    const endFigure: string = gameRoom.board[endPos[0]][endPos[1]];

    const isFigureNotFound = figure === FIGURES.EMPTY;

    const isMoveToOwnFigure =
      (client.id === gameRoom.white.socket &&
        WHITE_FIGURES.includes(endFigure)) ||
      (client.id === gameRoom.black.socket &&
        BLACK_FIGURES.includes(endFigure));

    const isOpponentFigure =
      (client.id === gameRoom.white.socket && BLACK_FIGURES.includes(figure)) ||
      (client.id === gameRoom.black.socket && WHITE_FIGURES.includes(figure));

    if (isFigureNotFound) throw new WsException('Figure not found');
    if (isMoveToOwnFigure) throw new WsException('Move to own figure');
    if (isOpponentFigure) throw new WsException("Move opponent's figure");
  }

  private checkKing = (props: movePropsType) => {
    checkSchemeAttack(props);

    // checkKingCastle(props);
  };

  private checkQueen(props: movePropsType) {
    checkSchemeAttack(props);

    const isFigureOnWay =
      checkDiagonalMove(props) || checkVerticalAndHorizontalMove(props);

    if (isFigureOnWay)
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );
  }

  private checkBishop(props: movePropsType) {
    checkSchemeAttack(props);

    const isFigureOnWay = checkDiagonalMove(props);

    if (isFigureOnWay)
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );
  }

  private checkRook(props) {
    checkSchemeAttack(props);

    const isFigureOnWay = checkVerticalAndHorizontalMove(props);

    if (isFigureOnWay)
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );
  }

  private checkPawn(props: movePropsType) {
    const { gameRoom, figure, startPos, endPos, x, y } = props;

    const initPawnPos = figure === FIGURES.WHITE_PAWN ? 6 : 1;
    const step = figure === FIGURES.WHITE_PAWN ? -1 : 1;
    const endFigure = gameRoom.board[endPos[0]][endPos[1]];

    const isStep = Math.abs(y) === 1 && x === 0 && endFigure === FIGURES.EMPTY;

    const isDiagonal =
      Math.abs(x) === 1 && y === step && endFigure !== FIGURES.EMPTY;

    const isTwoSteps =
      startPos[0] === initPawnPos &&
      Math.abs(y) === 2 &&
      endFigure === FIGURES.EMPTY &&
      gameRoom.board[startPos[0] + step][endPos[1]] === FIGURES.EMPTY;

    if (!isStep && !isDiagonal && !isTwoSteps)
      throw new WsException('A figure cannot move to this cell');
  }

  private checkEndGame = (props: movePropsType) => {
    const { endFigure, clientColor, gameRoom } = props;

    const isWinner = endFigure.toLowerCase() === FIGURES.BLACK_KING;

    if (isWinner) {
      gameRoom.winner = clientColor;
    }
  };
}
