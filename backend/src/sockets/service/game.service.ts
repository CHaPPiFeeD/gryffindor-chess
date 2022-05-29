import { Inject, Logger } from '@nestjs/common';
import { randomString } from '../../helpers';
import { alertBoard, findColors, findRoom } from '../../helpers/game';
import { UserQueueDto } from '../../dto/queue.dto';
import { gameStateType, gameRoomType, MoveDto } from 'src/dto/game.dto';
import { InitGateway } from '../init.gateway';
import { ValidationService } from './validation.service';
import { Socket } from 'socket.io';
import { INIT_BOARD, COLORS, FIGURES } from 'src/enum/constants';
import { BoardService } from './board.service';
import { movePropsType } from 'src/dto/validation.dto';

export class GameService {
  private gamesStates: gameStateType = new Map();
  private logger = new Logger(GameService.name);

  @Inject(InitGateway)
  initGateway: InitGateway;

  @Inject(ValidationService)
  validationService: ValidationService;

  @Inject(BoardService)
  boardService: BoardService;

  startGame(playerOne: UserQueueDto, playerTwo: UserQueueDto) {
    const roomId: string = randomString(16);
    const { white, black } = findColors(playerOne, playerTwo);

    const gameRoom: gameRoomType = {
      roomId,
      white,
      black,
      board: INIT_BOARD(),
      moveQueue: COLORS.WHITE,
    };

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createBoardsForPlayers(gameRoom);

    gameRoom.white.ways = whiteWays;
    gameRoom.black.ways = blackWays;

    this.gamesStates.set(roomId, gameRoom);

    alertBoard(this.logger, gameRoom.board, gameRoom.roomId);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    this.initGateway.server
      .in([white.socket, black.socket])
      .socketsJoin(gameRoom.roomId);

    this.initGateway.server.in(white.socket).emit('/game/start', {
      color: 'white',
      board: whiteBoard,
      ways: whiteWays,
    });

    this.initGateway.server.in(black.socket).emit('/game/start', {
      color: 'black',
      board: blackBoard,
      ways: [],
    });
  }

  chessMove(client: Socket, data: MoveDto) {
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

    const nextPlayerMove = this.validationService.checkMoveQueue(props);

    this.validationService.validationMove(props);

    gameRoom.moveQueue = nextPlayerMove;
    gameRoom.board[endPos[0]][endPos[1]] = figure;
    gameRoom.board[startPos[0]][startPos[1]] = FIGURES.EMPTY;

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createBoardsForPlayers(gameRoom);

    gameRoom.white.ways = whiteWays;
    gameRoom.black.ways = blackWays;

    alertBoard(this.logger, gameRoom.board, roomId);
    alertBoard(this.logger, whiteBoard, 'white board');
    alertBoard(this.logger, blackBoard, 'black board');

    this.initGateway.server.in(gameRoom.white.socket).emit('/game/move:get', {
      color: COLORS.WHITE,
      board: whiteBoard,
      ways: nextPlayerMove === COLORS.WHITE ? whiteWays : [],
    });

    this.initGateway.server.in(gameRoom.black.socket).emit('/game/move:get', {
      color: COLORS.BLACK,
      board: blackBoard,
      ways: nextPlayerMove === COLORS.BLACK ? blackWays : [],
    });
  }
}
