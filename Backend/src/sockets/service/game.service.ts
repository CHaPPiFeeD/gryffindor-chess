import { Inject, Logger } from '@nestjs/common';
import { randomString } from '../../helpers';
import { findColors } from '../../helpers/game';
import { UserQueueDto } from '../../dto/queue.dto';
import { gameStateType, gameType, MoveDto } from 'src/dto/game.dto';
import { InitGateway } from '../init.gateway';
import { ValidationService } from './validation.service';

export class GameService {
  private gamesStates: gameStateType = new Map();
  private logger = new Logger(GameService.name);

  @Inject(InitGateway)
  initGateway: InitGateway;

  @Inject(ValidationService)
  validationService: ValidationService;

  startGame(playerOne: UserQueueDto, playerTwo: UserQueueDto) {
    const room: string = randomString(16);
    const { white, black } = findColors(playerOne, playerTwo);
    const gameState: gameType = {
      roomName: room,
      white,
      black,
      board: [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // lover case - black
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // upper case - white
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
      ],
    };

    this.gamesStates.set(room, gameState);

    this.initGateway.server
      .in([white.socket, black.socket])
      .socketsJoin(gameState.roomName);

    this.logger.log(gameState.roomName);
    gameState.board.forEach((value) => this.logger.log(JSON.stringify(value)));

    this.initGateway.server
      .in(gameState.roomName)
      .emit('/game/start', gameState);
  }

  chessMove(data: MoveDto) {
    try {
      const { room, startPos, endPos } = data;
      const game: gameType = this.gamesStates.get(room);
      const figure: string = game.board[startPos[0]][startPos[1]];

      if (
        this.validationService.validationMove(
          figure,
          game.board,
          startPos,
          endPos,
        )
      ) {
        this.logger.debug('chessMove is worked');

        game.board[endPos[0]][endPos[1]] = figure;
        game.board[startPos[0]][startPos[1]] = '0';
      }

      // if (Object.is(figure, '0')) return;

      this.logger.log(game.roomName);
      game.board.forEach((value) => this.logger.log(JSON.stringify(value)));

      this.initGateway.server.in(room).emit('/game/move', { startPos, endPos });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
