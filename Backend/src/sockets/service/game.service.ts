import { Inject, Logger } from '@nestjs/common';
import { randomString } from '../../helpers';
import { alertBoard, findColors, findRoom } from '../../helpers/game';
import { UserQueueDto } from '../../dto/queue.dto';
import { gameStateType, gameType, MoveDto } from 'src/dto/game.dto';
import { InitGateway } from '../init.gateway';
import { ValidationService } from './validation.service';
import { Socket } from 'socket.io';
import { BOARD, FIGURES } from 'src/enum/constants';
import { BoardService } from './board.service';

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
    const game: gameType = {
      roomId,
      white,
      black,
      board: BOARD,
    };

    alertBoard(this.logger, game.board, game.roomId);

    const { whiteBoard, blackBoard, whiteWays, blackWays } =
      this.boardService.createBoardsForPlayers(game.board);

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

    this.initGateway.server
      .in(white.socket)
      .emit('/game/start', { whiteBoard, whiteWays });

    this.initGateway.server
      .in(black.socket)
      .emit('/game/start', { blackBoard, blackWays });
  }

  chessMove(client: Socket, data: MoveDto) {
    const { startPos, endPos } = data;
    const roomId = findRoom(client, this.gamesStates);
    const game: gameType = this.gamesStates.get(roomId);
    const figure: string = game.board[startPos[0]][startPos[1]];

    if (
      this.validationService.validationMove(
        client,
        figure,
        game,
        startPos,
        endPos,
      )
    ) {
      this.logger.log('chessMove is worked');

      game.board[endPos[0]][endPos[1]] = figure;
      game.board[startPos[0]][startPos[1]] = FIGURES.EMPTY;

      alertBoard(this.logger, game.board, roomId);

      const { whiteBoard, blackBoard, whiteWays, blackWays } =
        this.boardService.createBoardsForPlayers(game.board);

      alertBoard(this.logger, whiteBoard, 'white board');
      this.logger.log(whiteWays);
      alertBoard(this.logger, blackBoard, 'black board');
      this.logger.log(blackWays);

      this.initGateway.server
        .in(roomId)
        .emit('/game/move', { startPos, endPos });
    }
  }
}
