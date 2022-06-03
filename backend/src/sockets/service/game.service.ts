import { Inject, Logger } from '@nestjs/common';
import { randomString } from '../../helpers';
import {
  alertBoard,
  Game,
  findColors,
  findRoom,
  getPlayersColors,
} from '../../helpers/game';
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
  COLORS,
  FIGURES,
  SECOND_LETTER,
  FIRST_LETTER,
  BLACK_FIGURES,
  WHITE_FIGURES,
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

    const gameRoom: gameRoomType = new Game(roomId, white, black);

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
      players: {
        white: white.name,
        black: black.name,
      },
      color: COLORS.WHITE,
      board: whiteBoard,
      ways: whiteWays,
      moveQueue: COLORS.WHITE,
      gameStart: gameRoom.gameStart,
    });

    this.serverGateway.server.in(black.socket).emit('/game/start', {
      players: {
        white: white.name,
        black: black.name,
      },
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

    const [clientColor, enemyColor] = getPlayersColors(client, gameRoom);

    this.validationService.checkMoveQueue(props);
    this.validationService.validationMove({ ...props, clientColor });

    this.checkChangeFigure({ ...props, clientColor });
    this.checkEatFigure({ ...props, clientColor });

    figure = gameRoom.board[+startPos[0]][+startPos[1]]; // update

    const [whiteLog, blackLog] = this.updateLog({ ...props, clientColor });

    gameRoom.moveQueue = enemyColor;
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
      ways: enemyColor === COLORS.WHITE ? whiteWays : [],
      log: whiteLog,
      eatFigures: gameRoom.eatenFigures,
    });

    this.serverGateway.server.in(gameRoom.black.socket).emit('/game/move:get', {
      board: blackBoard,
      moveQueue: gameRoom.moveQueue,
      ways: enemyColor === COLORS.BLACK ? blackWays : [],
      log: blackLog,
      eatFigures: gameRoom.eatenFigures,
    });

    if (gameRoom.winner) {
      this.logger.debug(gameRoom.winner);

      this.serverGateway.server
        .in(gameRoom[clientColor].socket)
        .emit('/game/end', {
          title: 'You win!',
          message: "You have eaten the opponent's king piece.",
          gameEnd: gameRoom.gameEnd,
          board: gameRoom.board,
          ways: [],
          log: gameRoom.log,
        });

      this.serverGateway.server
        .in(gameRoom[enemyColor].socket)
        .emit('/game/end', {
          title: 'You lost!',
          message: 'The opponent has eaten your king piece.',
          gameEnd: gameRoom.gameEnd,
          board: gameRoom.board,
          ways: [],
          log: gameRoom.log,
        });
    }
  };

  draw = (client: Socket, isDrawing: boolean) => {
    const roomId = findRoom(client, this.gamesStates);

    if (!roomId) return;

    const gameRoom: gameRoomType = this.gamesStates.get(roomId);

    const [clientColor, enemyColor] = getPlayersColors(client, gameRoom);

    if (gameRoom[clientColor].offersDraw && gameRoom[enemyColor].offersDraw)
      return;

    if (!isDrawing) gameRoom[enemyColor].offersDraw = false;

    gameRoom[clientColor].offersDraw = isDrawing;

    if (gameRoom[clientColor].offersDraw && gameRoom[enemyColor].offersDraw) {
      gameRoom.gameEnd = new Date();
      gameRoom.winner = 'draw';

      this.serverGateway.server.in(roomId).emit('/game/end', {
        title: 'Draw!',
        message: 'You agreed to a draw',
        gameEnd: gameRoom.gameEnd,
        board: gameRoom.board,
        ways: [],
        moveQueue: null,
      });
    } else if (isDrawing) {
      this.serverGateway.server
        .in(gameRoom[enemyColor].socket)
        .emit('/game/draw');
    }
  };

  disconnect = (client: Socket, message: string) => {
    const roomId = findRoom(client, this.gamesStates);

    if (!roomId) return;

    const gameRoom: gameRoomType = this.gamesStates.get(roomId);

    let leaving: string, winner: string;

    if (gameRoom.white.socket === client.id) {
      winner = COLORS.BLACK;
      leaving = COLORS.WHITE;
    } else {
      winner = COLORS.WHITE;
      leaving = COLORS.BLACK;
    }

    gameRoom[leaving].socket = null;

    if (gameRoom.white.socket === null && gameRoom.black.socket === null)
      this.gamesStates.delete(roomId);

    if (gameRoom.winner) return;

    gameRoom.winner = winner;
    gameRoom.gameEnd = new Date();

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

  private checkChangeFigure = (props: movePropsType) => {
    const { figure, endPos, clientColor, gameRoom, startPos, change } = props;

    const pawn = clientColor === 'white' ? 'P' : 'p';

    const isChange = figure === pawn && (endPos[0] === 0 || endPos[0] === 7);

    if (isChange)
      gameRoom.board[startPos[0]][startPos[1]] = change.chooseFigure;
  };

  private checkEatFigure = (props: movePropsType) => {
    const { gameRoom, endPos, clientColor } = props;
    const endFigure = gameRoom.board[endPos[0]][endPos[1]];

    if (BLACK_FIGURES.includes(endFigure) || WHITE_FIGURES.includes(endFigure))
      gameRoom.eatenFigures[clientColor].push(endFigure);
  };

  private updateLog = (props: movePropsType) => {
    const { startPos, endPos, gameRoom, clientColor } = props;

    const figure = gameRoom.board[+startPos[0]][+startPos[1]];

    const newLog = [
      figure,
      FIRST_LETTER[startPos[1]],
      SECOND_LETTER[startPos[0]],
      FIRST_LETTER[endPos[1]],
      SECOND_LETTER[endPos[0]],
    ].join('');

    const log: logType = {
      color: clientColor,
      log: newLog,
    };

    gameRoom.log.push(log);

    const whiteLog = [];
    const blackLog = [];

    gameRoom.log.forEach((v) => {
      if (v.color === COLORS.WHITE) whiteLog.push(v);
      if (v.color === COLORS.BLACK) blackLog.push(v);
    });

    return [whiteLog, blackLog];
  };
}
