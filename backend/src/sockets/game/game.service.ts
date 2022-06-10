import { Inject, Logger } from '@nestjs/common';
import {
  alertBoard,
  findRoomBySocketId,
  findRoomByUserId,
} from '../../helpers/game';
import { ISocket, MoveType, QueueUserType } from '../../types';
import { ValidationService } from './validation.service';
import { Socket } from 'socket.io';
import { COLORS } from 'src/enums/constants';
import { BoardService } from './board.service';
import { ServerGateway } from '../server/server.gateway';
import { Game } from 'src/models/game.model';
import { Timeout, SchedulerRegistry } from '@nestjs/schedule';
import { randomString } from 'src/helpers';

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
    const [whiteLog, blackLog] = game.getLogsForPlayers();
    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createFogBoards(game);

    const data: any = {
      players: {
        white: game.white.name,
        black: game.black.name,
      },
      gameStart: game.gameStart,
      moveQueue: game.moveQueue,
      eatFigures: game.eatenFigures,
    };

    const whiteData = {
      ...data,
      color: COLORS.WHITE,
      board: whiteBoard,
      ways: game.moveQueue === COLORS.WHITE ? whiteWays : [],
      log: whiteLog,
    };

    const blackData = {
      ...data,
      color: COLORS.BLACK,
      board: blackBoard,
      ways: game.moveQueue === COLORS.BLACK ? blackWays : [],
      log: blackLog,
    };

    this.serverGateway.server
      .in(game.white.socket)
      .emit('/game:get', whiteData);

    this.serverGateway.server
      .in(game.black.socket)
      .emit('/game:get', blackData);

    alertBoard(this.logger, game.board, game.id);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    if (game.winner) {
      const [clientColor, opponentsColor] = game.getColorsBySocket(socketId);

      const endData = {
        ...data,
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        log: game.log,
        moveQueue: game.moveQueue,
        eatFigures: game.eatenFigures,
      };

      console.log(endData);

      this.serverGateway.server.in(game[clientColor].socket).emit('/game/end', {
        title: 'You win!',
        message: "You have eaten the opponent's king piece.",
        color: clientColor,
        ...endData,
      });

      this.serverGateway.server
        .in(game[opponentsColor].socket)
        .emit('/game/end', {
          title: 'You lost!',
          message: 'The opponent has eaten your king piece.',
          color: opponentsColor,
          ...endData,
        });
    }
  }

  moveChess = (client: Socket, move: MoveType) => {
    const roomId = findRoomBySocketId(client.id, this.gamesStates);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);
    const [clientColor, opponentsColor] = game.getColorsBySocket(client.id);

    this.validationService.validationMove(client, game, move);

    game.updateLog(client, move);
    game.move(client, move);

    this.sendGame(client.id);

    if (game.winner) {
      this.logger.debug(game.winner);

      const data = {
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        log: game.log,
      };

      this.serverGateway.server.in(game[clientColor].socket).emit('/game/end', {
        title: 'You win!',
        message: "You have eaten the opponent's king piece.",
        ...data,
      });

      this.serverGateway.server
        .in(game[opponentsColor].socket)
        .emit('/game/end', {
          title: 'You lost!',
          message: 'The opponent has eaten your king piece.',
          ...data,
        });
    }
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
      game.winner = 'draw';

      this.serverGateway.server.in(roomId).emit('/game/end', {
        title: 'Draw!',
        message: 'You agreed to a draw',
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        moveQueue: null,
        log: game.log,
      });
    } else if (isDrawing) {
      this.serverGateway.server
        .in(game[opponentsColor].socket)
        .emit('/game/draw');
    }
  };

  connect(client: ISocket) {
    const roomId = this.findRoomByUserId(client.user.id);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);
    const [clientColor] = game.getColorsByUserId(client.user.id);

    const timeout = this.schedulerRegistry.getTimeout(client.user.id);
    clearTimeout(timeout);
    this.schedulerRegistry.deleteTimeout(client.user.id);

    game[clientColor].socket = client.id;
  }

  reconnect(client: ISocket) {
    const roomId = this.findRoomByUserId(client.user.id);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);
    if (!game.winner) this.sendGame(client.id);
  }

  disconnect = (client: ISocket, message: string) => {
    const roomId = this.findRoomByUserId(client.user.id);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);
    const [leavingColor, winnerColor] = game.getColorsByUserId(client.user.id);

    game[leavingColor].socket = null;

    const callback = () => {
      // if (game.white.socket === null && game.black.socket === null)
      //   this.gamesStates.delete(roomId);

      if (game.winner) return;

      game.winner = winnerColor;
      game.gameEnd = new Date();

      // this.serverGateway.server.in(client.id).emit('/game/end', {
      //   title: 'You lost!',
      //   message: 'You surrendered!',
      //   gameEnd: game.gameEnd,
      //   board: game.board,
      //   ways: [],
      //   moveQueue: null,
      // });

      this.serverGateway.server.in(game[winnerColor].socket).emit('/game/end', {
        title: 'You win!',
        message,
        gameEnd: game.gameEnd,
        board: game.board,
        ways: [],
        moveQueue: null,
      });

      const timeout = this.schedulerRegistry.getTimeout(client.user.id);
      clearTimeout(timeout);
    };

    const timeout = setTimeout(callback, 10000);
    this.schedulerRegistry.addTimeout(client.user.id, timeout);
  };

  private findRoomByUserId(userId: string): string {
    for (const game of this.gamesStates.values()) {
      if (game.white.userId === userId || game.black.userId === userId)
        return game.id;
    }
  }
}