import { Inject, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Game } from 'src/models/game.model';
import { MoveType, MovePropsType } from 'src/types';
import { BLACK_FIGURES, FIGURES, WHITE_FIGURES } from '../../enum/constants';
import {
  checkDiagonalMove,
  checkSchemeAttack,
  checkVerticalAndHorizontalMove,
} from '../../helpers/validation';
import { ServerGateway } from '../server.gateway';

export class ValidationService {
  private logger = new Logger();
  private initPos = 7;

  @Inject(ServerGateway)
  serverGateway: ServerGateway;

  validationMove(client: Socket, game: Game, move: MoveType) {
    const startFigure = game.getFigureFromStart(move);
    const x: number = move.end[1] - move.start[1];
    const y: number = move.end[0] - move.start[0];
    const attackRow: number = this.initPos + y;
    const attackCol: number = this.initPos + x;

    this.basicСheck(client, game, move);

    const props: MovePropsType = {
      client,
      game,
      move,
      attackRow,
      attackCol,
      x,
      y,
    };

    switch (true) {
      case startFigure.toLowerCase() === FIGURES.BLACK_KING:
        this.checkKing(props);
        break;

      case startFigure.toLowerCase() === FIGURES.BLACK_QUEEN:
        this.checkQueen(props);
        break;

      case startFigure.toLowerCase() === FIGURES.BLACK_BISHOP:
        this.checkBishop(props);
        break;

      case startFigure.toLowerCase() === FIGURES.BLACK_KNIGHT:
        checkSchemeAttack(props);
        break;

      case startFigure.toLowerCase() === FIGURES.BLACK_ROOK:
        this.checkRook(props);
        break;

      case startFigure.toLowerCase() === FIGURES.BLACK_PAWN:
        this.checkPawn(props);
        break;
    }

    this.checkEndGame(client, game, move);
  }

  private basicСheck(client: Socket, game: Game, move: MoveType) {
    if (game.winner)
      throw new WsException("You can't move after the game is over");

    if (
      move.end[0] < 0 ||
      move.end[0] > 7 ||
      move.end[1] < 0 ||
      move.end[1] > 7
    )
      throw new WsException('Wrong coordinates');

    const startFigure = game.getFigureFromStart(move);
    const endFigure = game.getFigureFromEnd(move);
    const [clientColor] = game.getColorsBySocket(client.id);

    if (clientColor !== game.moveQueue)
      throw new WsException("Opponent's move order");

    if (startFigure === FIGURES.EMPTY)
      throw new WsException('Figure not found');

    if (
      (client.id === game.white.socket && WHITE_FIGURES.includes(endFigure)) ||
      (client.id === game.black.socket && BLACK_FIGURES.includes(endFigure))
    )
      throw new WsException('Move to own figure');

    if (
      // eslint-disable-next-line prettier/prettier
      (client.id === game.white.socket && BLACK_FIGURES.includes(startFigure)) ||
      (client.id === game.black.socket && WHITE_FIGURES.includes(startFigure))
    )
      throw new WsException("Move opponent's figure");
  }

  private checkKing = (props: MovePropsType) => {
    checkSchemeAttack(props);

    // checkKingCastle(props);
  };

  private checkQueen(props: MovePropsType) {
    checkSchemeAttack(props);

    if (checkDiagonalMove(props) || checkVerticalAndHorizontalMove(props))
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );
  }

  private checkBishop(props: MovePropsType) {
    checkSchemeAttack(props);

    if (checkDiagonalMove(props))
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );
  }

  private checkRook(props: MovePropsType) {
    const { client, game, move } = props;
    const [clientColor] = game.getColorsBySocket(client.id);

    checkSchemeAttack(props);

    if (checkVerticalAndHorizontalMove(props))
      throw new WsException(
        'A figure on the path does not allow you to go to this cell',
      );

    if (move.start[1] === 0) game[clientColor].rules.castling.long = false;
    if (move.start[1] === 7) game[clientColor].rules.castling.short = false;
  }

  private checkPawn(props: MovePropsType) {
    const { game, move, x, y } = props;
    const startFigure = game.getFigureFromStart(move);
    const endFigure = game.getFigureFromEnd(move);

    const initPawnPos = startFigure === FIGURES.WHITE_PAWN ? 6 : 1;
    const step = startFigure === FIGURES.WHITE_PAWN ? -1 : 1;

    const isStep = Math.abs(y) === 1 && x === 0 && endFigure === FIGURES.EMPTY;

    const isDiagonal =
      Math.abs(x) === 1 && y === step && endFigure !== FIGURES.EMPTY;

    const isTwoSteps =
      move.start[0] === initPawnPos &&
      Math.abs(y) === 2 &&
      endFigure === FIGURES.EMPTY &&
      game.board[move.start[0] + step][move.end[1]] === FIGURES.EMPTY;

    if (this.checkInterceptionMove({ ...props, x, y, step })) {
      game.clearInterceptionWays();
      return;
    }

    if (!isStep && !isDiagonal && !isTwoSteps)
      throw new WsException('A figure cannot move to this cell');

    game.clearInterceptionWays();

    if (isTwoSteps) this.addInterceptionMove({ ...props, step });
  }

  private checkInterceptionMove = (props) => {
    const { game, move, client, x, y, step } = props;
    const [clientColor] = game.getColorsBySocket(client.id);

    let isInterception;

    if (Math.abs(x) === 1 && y === step) {
      game[clientColor].rules.interception?.forEach((v) => {
        if (
          v.move.start[0] === move.start[0] &&
          v.move.start[1] === move.start[1] &&
          v.move.end[0] === move.end[0] &&
          v.move.end[1] === move.end[1]
        ) {
          game.board[v.figurePosition[0]][v.figurePosition[1]] = FIGURES.EMPTY;
          isInterception = true;
        }
      });
    }

    return isInterception;
  };

  private addInterceptionMove = (props) => {
    const { game, move, step, client } = props;
    const [clientColor, opponentColor] = game.getColorsBySocket(client.id);

    if (
      move.end[1] - 1 > 0 &&
      game.board[move.end[0]][move.end[1] - 1].toLowerCase() ===
        FIGURES.BLACK_PAWN
    ) {
      game[opponentColor].rules.interception.push({
        move: {
          start: [move.end[0], move.end[1] - 1],
          end: [move.end[0] - step, move.end[1]],
        },
        figurePosition: [move.end[0], move.end[1]],
      });
    }

    if (
      move.end[1] + 1 < 7 &&
      game.board[move.end[0]][move.end[1] + 1].toLowerCase() ===
        FIGURES.BLACK_PAWN
    ) {
      game[opponentColor].rules.interception.push({
        move: {
          start: [move.end[0], move.end[1] + 1],
          end: [move.end[0] - step, move.end[1]],
        },
        figurePosition: [move.end[0], move.end[1]],
      });
    }
  };

  private checkEndGame = (client: Socket, game: Game, move: MoveType) => {
    const endFigure = game.getFigureFromEnd(move);
    const [clientColor] = game.getColorsBySocket(client.id);

    if (endFigure === FIGURES.BLACK_KING || endFigure === FIGURES.WHITE_KING) {
      game.winner = clientColor;
      game.gameEnd = new Date();
    }
  };
}
