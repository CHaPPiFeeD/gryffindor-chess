import { Inject, Logger } from '@nestjs/common';
import { alertBoard, findRoom } from '../../helpers/game';
import { MoveType, QueueUserType } from '../../types';
import { ValidationService } from './validation.service';
import { Socket } from 'socket.io';
import { COLORS } from 'src/enum/constants';
import { BoardService } from './board.service';
import { ServerGateway } from '../server.gateway';
import { Game } from 'src/models/game.model';

export class GameService {
  private logger = new Logger(GameService.name);
  private gamesStates = new Map<string, Game>();

  @Inject(ServerGateway)
  private serverGateway: ServerGateway;

  @Inject(ValidationService)
  private validationService: ValidationService;

  @Inject(BoardService)
  private boardService: BoardService;

  startGame(playerOne: QueueUserType, playerTwo: QueueUserType) {
    const game = new Game(playerOne, playerTwo);

    const { whiteBoard, blackBoard, whiteWays } =
      this.boardService.createFogBoards(game);

    this.gamesStates.set(game.id, game);

    alertBoard(this.logger, game.board, game.id);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    this.serverGateway.server
      .in([game.white.socket, game.black.socket])
      .socketsJoin(game.id);

    this.serverGateway.server.in(game.white.socket).emit('/game/start', {
      players: {
        white: game.white.name,
        black: game.black.name,
      },
      color: COLORS.WHITE,
      board: whiteBoard,
      ways: whiteWays,
      moveQueue: COLORS.WHITE,
      gameStart: game.gameStart,
    });

    this.serverGateway.server.in(game.black.socket).emit('/game/start', {
      players: {
        white: game.white.name,
        black: game.black.name,
      },
      color: COLORS.BLACK,
      board: blackBoard,
      ways: [],
      moveQueue: COLORS.WHITE,
      gameStart: game.gameStart,
    });
  }

  moveChess = (client: Socket, move: MoveType) => {
    const roomId = findRoom(client, this.gamesStates);
    if (!roomId) return;
    const game = this.gamesStates.get(roomId);
    const [clientColor, opponentsColor] = game.getColorsBySocket(client.id);

    this.validationService.validationMove(client, game, move);

    game.updateLog(client, move);
    game.move(client, move);
    const [whiteLog, blackLog] = game.getLogsForPlayers();

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createFogBoards(game);
    const lastMoves = this.boardService.getLastMove(
      whiteBoard,
      blackBoard,
      move,
    );

    alertBoard(this.logger, game.board, roomId);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    this.serverGateway.server.in(game.white.socket).emit('/game/move:get', {
      board: whiteBoard,
      moveQueue: game.moveQueue,
      ways: opponentsColor === COLORS.WHITE ? whiteWays : [],
      log: whiteLog,
      eatFigures: game.eatenFigures,
      lastMove: lastMoves.white,
    });

    this.serverGateway.server.in(game.black.socket).emit('/game/move:get', {
      board: blackBoard,
      moveQueue: game.moveQueue,
      ways: opponentsColor === COLORS.BLACK ? blackWays : [],
      log: blackLog,
      eatFigures: game.eatenFigures,
      lastMove: lastMoves.black,
    });

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
    const roomId = findRoom(client, this.gamesStates);
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

  disconnect = (client: Socket, message: string) => {
    this.logger.debug(client.id);

    const roomId = findRoom(client, this.gamesStates);
    if (!roomId) return;
    const gameRoom = this.gamesStates.get(roomId);

    const [leaving, winner] = gameRoom.getColorsBySocket(client.id);

    gameRoom[leaving].socket = null;

    if (gameRoom.white.socket === null && gameRoom.black.socket === null)
      this.gamesStates.delete(roomId);

    if (gameRoom.winner) return;

    gameRoom.winner = winner;
    gameRoom.gameEnd = new Date();

    this.serverGateway.server.in(client.id).emit('/game/end', {
      title: 'You lost!',
      message: 'You surrendered!',
      gameEnd: gameRoom.gameEnd,
      board: gameRoom.board,
      ways: [],
      moveQueue: null,
    });

    this.serverGateway.server.in(gameRoom[winner].socket).emit('/game/end', {
      title: 'You win!',
      message,
      gameEnd: gameRoom.gameEnd,
      board: gameRoom.board,
      ways: [],
      moveQueue: null,
    });

    this.logger.debug(gameRoom.winner);
  };
}
