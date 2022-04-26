import { Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { randomString } from '../../helpers';
import { findColors } from '../../helpers/game';
import { userQueueDto } from '../../dto/queue.dto';
import { gameStateType, gameType, moveDto } from 'src/dto/game.dto';

export class GameService {
  private gamesStates: gameStateType = {};
  private logger = new Logger(GameService.name);

  @WebSocketServer()
  server: Server;

  startGame(
    playerOne: userQueueDto,
    playerTwo: userQueueDto,
    callback: (room: string) => void,
  ) {
    const room: string = randomString(16);
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

    callback(room);
  }

  chessMove(data: moveDto, callback: (room: string) => void) {
    const { room, startPos, endPos } = data;
    const game: gameType = this.gamesStates[room];
    const figure: string = game.board[startPos[0]][startPos[1]];
    game.board[endPos[0]][endPos[1]] = figure;
    game.board[startPos[0]][startPos[1]] = '0';

    callback(room);
  }
}
