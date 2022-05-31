import { Inject, Logger } from '@nestjs/common';
import { randomString } from '../../helpers';
import { alertBoard, findColors, findRoom } from '../../helpers/game';
import { UserQueueDto } from '../../dto/queue.dto';
import { gameStateType, gameRoomType, MoveDto } from 'src/dto/game.dto';
import { ValidationService } from './validation.service';
import { Socket } from 'socket.io';
import { INIT_BOARD, COLORS, FIGURES } from 'src/enum/constants';
import { BoardService } from './board.service';
import { movePropsType } from 'src/dto/validation.dto';
import { WsException } from '@nestjs/websockets';
import { ServerGateway } from '../server.gateway';

export class GameService {
  private logger = new Logger(GameService.name);
  private gamesStates: gameStateType = new Map();

  @Inject(ServerGateway)
  private serverGateway: ServerGateway;

  @Inject(ValidationService)
  private validationService: ValidationService;

  @Inject(BoardService)
  private boardService: BoardService;

  startGame = (playerOne: UserQueueDto, playerTwo: UserQueueDto) => {
    const roomId: string = randomString(16);
    const { white, black } = findColors(playerOne, playerTwo);

    const gameRoom: gameRoomType = {
      roomId,
      white,
      black,
      board: INIT_BOARD(),
      moveQueue: COLORS.WHITE,
      winner: null,
      gameStart: new Date(),
    };

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createFogBoards(gameRoom);

    gameRoom.white.ways = whiteWays;
    gameRoom.black.ways = blackWays;

    this.gamesStates.set(roomId, gameRoom);

    alertBoard(this.logger, gameRoom.board, gameRoom.roomId);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    this.serverGateway.server
      .in([white.socket, black.socket])
      .socketsJoin(gameRoom.roomId);

    this.serverGateway.server.in(white.socket).emit('/game/start', {
      color: COLORS.WHITE,
      board: whiteBoard,
      ways: whiteWays,
      moveQueue: COLORS.WHITE,
      gameStart: gameRoom.gameStart,
    });

    this.serverGateway.server.in(black.socket).emit('/game/start', {
      color: COLORS.BLACK,
      board: blackBoard,
      ways: [],
      moveQueue: COLORS.WHITE,
      gameStart: gameRoom.gameStart,
    });
  };

  moveChess = (client: Socket, data: MoveDto) => {
    const { startPos, endPos } = data;
    const roomId = findRoom(client, this.gamesStates);
    const gameRoom: gameRoomType = this.gamesStates.get(roomId);
    const figure = gameRoom.board[+startPos[0]][+startPos[1]];

    const props: movePropsType = {
      client,
      gameRoom,
      figure,
      startPos,
      endPos,
    };

    if (gameRoom.winner)
      throw new WsException("You can't move after the game is over");

    const [clientColor, nextPlayerMove] =
      this.validationService.checkMoveQueue(props);

    this.validationService.validationMove({ ...props, clientColor });

    gameRoom.moveQueue = nextPlayerMove;
    gameRoom.board[endPos[0]][endPos[1]] = figure;
    gameRoom.board[startPos[0]][startPos[1]] = FIGURES.EMPTY;

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createFogBoards(gameRoom);

    gameRoom.white.ways = whiteWays;
    gameRoom.black.ways = blackWays;

    alertBoard(this.logger, gameRoom.board, roomId);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    this.serverGateway.server.in(gameRoom.white.socket).emit('/game/move:get', {
      board: whiteBoard,
      moveQueue: gameRoom.moveQueue,
      ways:
        nextPlayerMove === COLORS.WHITE && !gameRoom.winner ? whiteWays : [],
    });

    this.serverGateway.server.in(gameRoom.black.socket).emit('/game/move:get', {
      board: blackBoard,
      moveQueue: gameRoom.moveQueue,
      ways:
        nextPlayerMove === COLORS.BLACK && !gameRoom.winner ? blackWays : [],
    });

    if (gameRoom.winner) {
      this.logger.debug(gameRoom.winner);

      this.serverGateway.server
        .in(gameRoom[clientColor].socket)
        .emit('/game/end', {
          title: 'You win!',
          message: "You have eaten the opponent's king piece.",
        });

      this.serverGateway.server
        .in(gameRoom[nextPlayerMove].socket)
        .emit('/game/end', {
          title: 'You lost!',
          message: 'The opponent has eaten your king piece.',
        });
    }
  };

  disconnect = (client: Socket, message: string) => {
    const roomId = findRoom(client, this.gamesStates);

    if (!roomId) return;

    const gameRoom: gameRoomType = this.gamesStates.get(roomId);
    let loser;

    for (const game of this.gamesStates.values()) {
      if (game.white.socket === client.id) {
        gameRoom.winner = 'black';
        loser = COLORS.WHITE;
      }

      if (game.black.socket === client.id) {
        gameRoom.winner = 'white';
        loser = COLORS.BLACK;
      }
    }

    if (gameRoom?.winner) {
      this.logger.debug(gameRoom.winner);

      this.serverGateway.server
        .in(gameRoom[gameRoom.winner].socket)
        .emit('/game/end', {
          title: 'You win!',
          message,
        });

      gameRoom[loser].socket = null;
    }
  };
}
