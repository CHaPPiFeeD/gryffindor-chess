import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Socket } from 'socket.io';
import { ObjectId } from 'mongoose';
import { findRoomBySocketId } from '../../helpers/game';
import { ISocket, MoveType, QueueUserType } from '../../types';
import { ValidationService } from './validation.service';
import { ServerGateway } from '../server/server.gateway';
import { Game } from '../../models/game.model';
import { WS_EVENTS } from '../../enums/constants';
import { PartyService } from '../../modules/party/party.service';
import { BoardService } from './board.service';

export class GameService {
  private logger = new Logger(GameService.name);
  private gamesStates = new Map<string, Game>();
  private schedulerRegistry = new SchedulerRegistry();

  @Inject(ServerGateway)
  private serverGateway: ServerGateway;

  @Inject(ValidationService)
  private validationService: ValidationService;

  @Inject(BoardService)
  private boardService: BoardService;

  @Inject(PartyService)
  private partyService: PartyService;

  startGame(playerOne: QueueUserType, playerTwo: QueueUserType) {
    const game = new Game(playerOne, playerTwo);

    this.gamesStates.set(game.id, game);

    this.serverGateway.server
      .in([game.white.socket, game.black.socket])
      .socketsJoin(game.id);

    this.sendGame(game.white.socket);
  }

  sendGame(socketId: string) {
    const roomId = findRoomBySocketId(socketId, this.gamesStates);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);
    const boardsAndWays = this.boardService.createWays(game);
    const data = game.getDataForPlayers(boardsAndWays);

    this.serverGateway.server
      .in(game.white.socket)
      .emit(WS_EVENTS.GAME.GET_GAME, data.white);

    this.serverGateway.server
      .in(game.black.socket)
      .emit(WS_EVENTS.GAME.GET_GAME, data.black);

    // alertBoard(this.logger, game.board, game.id);
    // alertBoard(this.logger, data.white.board, 'white board');
    // alertBoard(this.logger, data.black.board, 'black board');

    if (game.gameEnd) {
      const [clientColor, opponentsColor] = game.getColorsBySocket(socketId);

      this.serverGateway.server
        .in(game[clientColor].socket)
        .emit(WS_EVENTS.GAME.END, {
          title: 'You win!',
          message: "You have eaten the opponent's king piece.",
          color: clientColor,
          ...data.end,
        });

      this.serverGateway.server
        .in(game[opponentsColor].socket)
        .emit(WS_EVENTS.GAME.END, {
          title: 'You lost!',
          message: 'The opponent has eaten your king piece.',
          color: opponentsColor,
          ...data.end,
        });

      this.partyService.create(game);
      this.serverGateway.server
        .in([game.white.socket, game.black.socket])
        .socketsLeave(game.id);
      this.gamesStates.delete(game.id);
    }
  }

  moveChess = (client: Socket, move: MoveType) => {
    const roomId = findRoomBySocketId(client.id, this.gamesStates);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);

    this.validationService.validationMove(client, game, move);

    game.updateLog(client, move);
    game.move(client, move);

    this.sendGame(client.id);
  };

  draw = (client: Socket, isDrawing: boolean) => {
    const roomId = findRoomBySocketId(client.id, this.gamesStates);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);

    const [clientColor, opponentsColor] = game.getColorsBySocket(client.id);

    if (game[clientColor].offersDraw && game[opponentsColor].offersDraw) return;
    if (!isDrawing) game[opponentsColor].offersDraw = false;

    game[clientColor].offersDraw = isDrawing;

    if (game[clientColor].offersDraw && game[opponentsColor].offersDraw) {
      game.gameEnd = new Date();

      this.serverGateway.server.in(roomId).emit(WS_EVENTS.GAME.END, {
        title: 'Draw!',
        message: 'You agreed to a draw',
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        moveQueue: null,
        log: game.log,
      });

      this.serverGateway.server
        .in([game.white.socket, game.black.socket])
        .socketsLeave(game.id);

      this.partyService.create(game);
      this.gamesStates.delete(game.id);
    } else if (isDrawing) {
      this.serverGateway.server
        .in(game[opponentsColor].socket)
        .emit(WS_EVENTS.GAME.DRAW);
    }
  };

  connect(client: ISocket) {
    const game = this.getGame(client.user.id);
    if (!game) return;

    const [clientColor, opponentColor] = game.getColorsByUserId(client.user.id);

    const timeout = this.schedulerRegistry.getTimeout(client.user.id);
    clearTimeout(timeout);
    this.schedulerRegistry.deleteTimeout(client.user.id);

    game[clientColor].socket = client.id;

    this.serverGateway.server
      .in(game[opponentColor].socket)
      .emit(WS_EVENTS.GAME.DISCONNECT_OPPONENT, false);
  }

  reconnect(client: ISocket) {
    const game = this.getGame(client.user.id);
    if (!game) return;
    if (!game.gameEnd) this.sendGame(client.id);
  }

  disconnect = (client: ISocket, message: string) => {
    const game = this.getGame(client.user.id);
    if (!game) return;

    const [leavingColor, winnerColor] = game.getColorsByUserId(client.user.id);

    if (!game.gameEnd && (game.white.socket || game.black.socket)) {
      game[leavingColor].socket = null;

      const callback = () => {
        if (game.gameEnd) return;

        game.winner = game[winnerColor].userId;
        game.gameEnd = new Date();

        this.serverGateway.server
          .in(game[winnerColor].socket)
          .emit(WS_EVENTS.GAME.DISCONNECT_OPPONENT, false);

        this.serverGateway.server
          .in(game[winnerColor].socket)
          .emit(WS_EVENTS.GAME.END, {
            title: 'You win!',
            message,
            gameEnd: game.gameEnd,
            board: game.board,
            ways: [],
            moveQueue: null,
          });

        const timeout = this.schedulerRegistry.getTimeout(client.user.id);
        clearTimeout(timeout);
        this.schedulerRegistry.deleteTimeout(client.user.id);

        this.serverGateway.server
          .in([game.white.socket, game.black.socket])
          .socketsLeave(game.id);

        this.partyService.create(game);
        this.gamesStates.delete(game.id);
      };

      const timeout = setTimeout(callback, 30000);
      this.schedulerRegistry.addTimeout(client.user.id, timeout);

      this.serverGateway.server
        .in(game[winnerColor].socket)
        .emit(WS_EVENTS.GAME.DISCONNECT_OPPONENT, true);
    }
  };

  surrennder(client: ISocket) {
    const game = this.getGame(client.user.id);
    if (!game) return;

    const [surrenderColor, winnerColor] = game.getColorsByUserId(
      client.user.id,
    );

    if (game.gameEnd) return;

    game.winner = game[winnerColor].userId;
    game.gameEnd = new Date();

    this.serverGateway.server
      .in(game[winnerColor].socket)
      .emit(WS_EVENTS.GAME.END, {
        title: 'You win!',
        message: 'Your opponent has surrendered!',
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        moveQueue: null,
      });

    this.serverGateway.server
      .in(game[surrenderColor].socket)
      .emit(WS_EVENTS.GAME.END, {
        title: 'You lost!',
        message: 'You surrendered!',
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        moveQueue: null,
      });

    game[surrenderColor].socket = null;
    game[winnerColor].socket = null;

    this.serverGateway.server
      .in([game.white.socket, game.black.socket])
      .socketsLeave(game.id);

    this.partyService.create(game);
    this.gamesStates.delete(game.id);
  }

  private getGame(userId: ObjectId): Game {
    let roomId;

    for (const game of this.gamesStates.values()) {
      if (game.white.userId === userId || game.black.userId === userId)
        roomId = game.id;
    }

    return this.gamesStates.get(roomId);
  }
}
