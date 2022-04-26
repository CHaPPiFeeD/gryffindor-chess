import { Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { randomString } from '../../helpers';
import { findColors } from '../../helpers/game';

export class GameService {
  private gamesStates = {};
  private logger = new Logger(GameService.name);

  @WebSocketServer()
  server: Server;

  startGame(playerOne, playerTwo, callback) {
    const room = randomString(16);
    const { white, black } = findColors(playerOne, playerTwo);

    this.gamesStates[room] = {
      roomName: room,
      white: white,
      black: black,
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

    this.logger.log('---gameStates---', JSON.stringify(this.gamesStates));

    callback(room);
  }

  chessMove({ room, posOne, posTwo }, callback) {
    const game = this.gamesStates[room];
    this.logger.debug(game);

    const figure = game.board[posOne[0]][posOne[1]];
    game.board[posTwo[0]][posTwo[1]] = figure;
    game.board[posOne[0]][posOne[1]] = '0';
    this.logger.log('---gameStates---', JSON.stringify(this.gamesStates[room]));
    this.logger.log(
      '---board---',
      JSON.stringify(this.gamesStates[room].board),
    );

    callback(room);
  }
}
