import { Inject, Logger } from '@nestjs/common';
// import { WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';
import { randomString } from '../../helpers';
import { findColors } from '../../helpers/game';
import { userQueueDto } from '../../dto/queue.dto';
import { gameStateType, gameType, moveDto } from 'src/dto/game.dto';
import { InitGateway } from '../init.gateway';
// import { SocketService } from './socket.service';

export class GameService {
  private gamesStates: gameStateType = new Map();
  private logger = new Logger(GameService.name);

  @Inject(InitGateway)
  initGateway: InitGateway;

  startGame(playerOne: userQueueDto, playerTwo: userQueueDto) {
    const room: string = randomString(16);
    const { white, black } = findColors(playerOne, playerTwo);
    const gameState: gameType = {
      roomName: room,
      white,
      black,
      board: [
        ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'],
      ],
    };

    this.gamesStates.set(room, gameState);

    this.initGateway.server
      .in([white.socket, black.socket])
      .socketsJoin(gameState.roomName);

    this.logger.debug(gameState);

    this.initGateway.server
      .in(gameState.roomName)
      .emit('/game/start', gameState);
  }

  chessMove(data: moveDto) {
    const { room, startPos, endPos } = data;
    const game: gameType = this.gamesStates.get(room);
    const figure: string = game.board[startPos[0]][startPos[1]];
    game.board[endPos[0]][endPos[1]] = figure;
    game.board[startPos[0]][startPos[1]] = '0';

    this.logger.debug('---game---', game);
    this.logger.debug('---set---', this.gamesStates.get(room));

    this.initGateway.server.in(room).emit('/game/move', { startPos, endPos });
  }
}
