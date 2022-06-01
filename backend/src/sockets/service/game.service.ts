import { Inject, Logger } from '@nestjs/common';
import { randomString } from '../../helpers';
import { alertBoard, findColors, findRoom } from '../../helpers/game';
import { UserQueueDto } from '../../dto/queue.dto';
import {
  gameStateType,
  gameRoomType,
  MoveDto,
  logType,
} from 'src/dto/game.dto';
import { ValidationService } from './validation.service';
import { Socket } from 'socket.io';
import {
  INIT_BOARD,
  COLORS,
  FIGURES,
  SECOND_LETTER,
  FIRST_LETTER,
} from 'src/enum/constants';
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
      log: [],
    };

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createFogBoards(gameRoom);

    gameRoom.white.ways = whiteWays;
    gameRoom.black.ways = blackWays;

    this.gamesStates.set(roomId, gameRoom);

    alertBoard(this.logger, gameRoom.board, gameRoom.roomId);
    alertBoard(this.logger, whiteBoard, 'white board');
    this.logger.debug(whiteWays);
    alertBoard(this.logger, blackBoard, 'black board');
    this.logger.debug(blackWays);

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
    let figure = gameRoom.board[+startPos[0]][+startPos[1]];

    const props: movePropsType = {
      ...data,
      client,
      gameRoom,
      figure,
    };

    if (gameRoom.winner)
      throw new WsException("You can't move after the game is over");

    const [clientColor, nextPlayerMove] =
      this.validationService.checkMoveQueue(props);

    this.validationService.validationMove({ ...props, clientColor });

    this.checkChange({ ...props, clientColor });

    figure = gameRoom.board[+startPos[0]][+startPos[1]]; // update

    gameRoom.moveQueue = nextPlayerMove;
    gameRoom.board[endPos[0]][endPos[1]] = figure;
    gameRoom.board[startPos[0]][startPos[1]] = FIGURES.EMPTY;

    const [whiteLog, blackLog] = this.updateLog({
      ...props,
      figure,
      clientColor,
    });

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
      log: whiteLog,
    });

    this.logger.debug(blackLog);
    this.logger.debug(whiteLog);

    this.serverGateway.server.in(gameRoom.black.socket).emit('/game/move:get', {
      board: blackBoard,
      moveQueue: gameRoom.moveQueue,
      ways:
        nextPlayerMove === COLORS.BLACK && !gameRoom.winner ? blackWays : [],
      log: blackLog,
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

  private checkChange = (props: movePropsType) => {
    const { figure, endPos, clientColor, gameRoom, startPos, change } = props;

    const pawn = clientColor === 'white' ? 'P' : 'p';

    const isChange = figure === pawn && (endPos[0] === 0 || endPos[0] === 7);

    if (isChange)
      gameRoom.board[startPos[0]][startPos[1]] = change.chooseFigure;
  };

  private updateLog = (props: movePropsType) => {
    const { figure, startPos, endPos, gameRoom, clientColor } = props;

    const startFirstLetter = FIRST_LETTER[startPos[0]];
    const startSecondLetter = SECOND_LETTER[startPos[1]];

    const endFirstLetter = FIRST_LETTER[endPos[0]];
    const endSecondLetter = SECOND_LETTER[endPos[1]];

    const newLog = [
      figure,
      startFirstLetter,
      startSecondLetter,
      endFirstLetter,
      endSecondLetter,
    ].join('');

    const log: logType = {
      color: clientColor,
      log: newLog,
    };

    this.logger.debug(log);

    gameRoom.log.push(log);

    this.logger.debug(JSON.stringify(gameRoom.log));

    const whiteLog = [];
    const blackLog = [];

    gameRoom.log.forEach((v) => {
      if (v.color === COLORS.WHITE) whiteLog.push(v);
      if (v.color === COLORS.BLACK) blackLog.push(v);

      this.logger.debug(v);
      this.logger.debug(v.color);
      this.logger.debug(COLORS.WHITE);
      this.logger.debug(v.color);
      this.logger.debug(COLORS.BLACK);
      this.logger.debug('===');
    });

    return [whiteLog, blackLog];
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
