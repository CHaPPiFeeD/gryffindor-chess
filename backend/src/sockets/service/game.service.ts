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
    const game: gameRoomType = {
      roomId,
      white,
      black,
      board: INIT_BOARD(),
      moveQueue: COLORS.WHITE,
    };

    alertBoard(this.logger, game.board, game.roomId);

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createBoardsForPlayers(game);

    game.white.ways = whiteWays;
    game.black.ways = blackWays;

    this.gamesStates.set(roomId, game);

    alertBoard(this.logger, whiteBoard, 'white board');
    this.logger.log(game.white.ways);
    alertBoard(this.logger, blackBoard, 'black board');
    this.logger.log(game.black.ways);

    this.initGateway.server
      .in([white.socket, black.socket])
      .socketsJoin(game.roomId);

    this.initGateway.server.in(white.socket).emit('/game/start', {
      color: 'white',
      board: whiteBoard,
      ways: whiteWays,
    });

    this.initGateway.server.in(black.socket).emit('/game/start', {
      color: 'black',
      board: blackBoard,
      ways: blackWays,
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

    const isAllowed = this.validationService.validationMove(props);

    if (isAllowed) {
      let clientColor, nextMove;

      if (client.id === gameRoom.white.socket) {
        clientColor = COLORS.WHITE;
        nextMove = COLORS.BLACK;
      }

      if (client.id === gameRoom.black.socket) {
        clientColor = COLORS.BLACK;
        nextMove = COLORS.WHITE;
      }

      if (clientColor !== gameRoom.moveQueue) return;
      if (clientColor === gameRoom.moveQueue) gameRoom.moveQueue = nextMove;

      this.logger.log('chessMove is worked');

      gameRoom.board[endPos[0]][endPos[1]] = figure;
      gameRoom.board[startPos[0]][startPos[1]] = FIGURES.EMPTY;

      alertBoard(this.logger, gameRoom.board, roomId);

      const { whiteBoard, blackBoard, whiteWays, blackWays } =
        this.boardService.createBoardsForPlayers(gameRoom);

      gameRoom.white.ways = whiteWays;
      gameRoom.black.ways = blackWays;

      alertBoard(this.logger, whiteBoard, 'white board');
      alertBoard(this.logger, blackBoard, 'black board');

      this.initGateway.server.in(gameRoom.white.socket).emit('/game/move:get', {
        color: 'white',
        board: whiteBoard,
        ways: whiteWays,
      });

      this.initGateway.server.in(gameRoom.black.socket).emit('/game/move:get', {
        color: 'black',
        board: blackBoard,
        ways: blackWays,
      });
    }
  }
}
