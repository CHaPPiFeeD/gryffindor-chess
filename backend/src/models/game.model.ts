import { Socket } from 'socket.io';
import { GamePlayerType, MoveType } from '../types';
import {
  INIT_BOARD,
  COLORS,
  FIRST_LETTER,
  SECOND_LETTER,
  FIGURES,
  BLACK_FIGURES,
  WHITE_FIGURES,
} from 'src/enums/constants';
import { randomString } from 'src/helpers';
import { setPlayerColors } from 'src/helpers/game';
import { ObjectId } from 'mongoose';

export class Game {
  id: string;
  white: GamePlayerType;
  black: GamePlayerType;
  board: string[][];
  eatenFigures: {
    white: string[];
    black: string[];
  };
  moveQueue: string;
  winner: ObjectId | null;
  gameStart: Date;
  gameEnd?: Date;
  log: string[];

  constructor(playerOne, playerTwo) {
    const { whitePlayer, blackPlayer } = setPlayerColors(playerOne, playerTwo);

    this.id = randomString(16);
    this.white = whitePlayer;
    this.black = blackPlayer;
    this.eatenFigures = {
      white: [],
      black: [],
    };
    this.board = INIT_BOARD();
    this.moveQueue = COLORS.WHITE;
    this.winner = null;
    this.gameStart = new Date();
    this.log = [];
  }

  updateLog(client: Socket, move: MoveType) {
    const figure = this.getFigureFromStart(move);

    const log: string = [
      figure,
      FIRST_LETTER[move.start[1]],
      SECOND_LETTER[move.start[0]],
      FIRST_LETTER[move.end[1]],
      SECOND_LETTER[move.end[0]],
    ].join('');

    this.log.push(log);
  }

  move(client: Socket, move: MoveType) {
    const startFigure = this.getFigureFromStart(move);
    const endFigure = this.getFigureFromEnd(move);
    const [clientColor, opponentsColor] = this.getColorsBySocket(client.id);

    const pawn = clientColor === 'white' ? 'P' : 'p';

    if (startFigure === pawn && (move.end[0] === 0 || move.end[0] === 7))
      this.board[move.start[0]][move.start[1]] = move.change.chooseFigure;

    if (BLACK_FIGURES.includes(endFigure) || WHITE_FIGURES.includes(endFigure))
      this.eatenFigures[clientColor].push(endFigure);

    this.board[move.end[0]][move.end[1]] =
      this.board[move.start[0]][move.start[1]];

    this.board[move.start[0]][move.start[1]] = FIGURES.EMPTY;

    this.moveQueue = opponentsColor;
  }

  getLogsForPlayers(): string[][] {
    const whiteLog = [];
    const blackLog = [];

    this.log.forEach((v) => {
      if (WHITE_FIGURES.includes(v.split('')[0]) || this.winner)
        whiteLog.push(v);
      if (BLACK_FIGURES.includes(v.split('')[0]) || this.winner)
        blackLog.push(v);
    });

    return [whiteLog, blackLog];
  }

  getColorsBySocket(clientId: string): string[] {
    if (clientId === this.white.socket) return [COLORS.WHITE, COLORS.BLACK];
    if (clientId === this.black.socket) return [COLORS.BLACK, COLORS.WHITE];
  }

  getColorsByUserId(userId: ObjectId): string[] {
    if (userId === this.white.userId) return [COLORS.WHITE, COLORS.BLACK];
    if (userId === this.black.userId) return [COLORS.BLACK, COLORS.WHITE];
  }

  getFigureFromStart(move: MoveType): string {
    return this.board[move.start[0]][move.start[1]];
  }

  getFigureFromEnd(move: MoveType): string {
    return this.board[move.end[0]][move.end[1]];
  }

  clearInterceptionWays() {
    this.white.rules.interception = [];
    this.black.rules.interception = [];
  }
}
