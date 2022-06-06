import { Socket } from 'socket.io';
import { GamePlayerType, LogType, MoveType } from '../types';
import {
  INIT_BOARD,
  COLORS,
  FIRST_LETTER,
  SECOND_LETTER,
  FIGURES,
  BLACK_FIGURES,
  WHITE_FIGURES,
} from 'src/enum/constants';
import { randomString } from 'src/helpers';
import { setPlayerColors } from 'src/helpers/game';

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
  winner: string | null;
  gameStart: Date;
  gameEnd?: Date;
  log: LogType[];

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
    const [clientColor] = this.getColorsBySocket(client.id);
    const figure = this.getFigureFromStart(move);

    const log: LogType = {
      color: clientColor,
      log: [
        figure,
        FIRST_LETTER[move.start[1]],
        SECOND_LETTER[move.start[0]],
        FIRST_LETTER[move.end[1]],
        SECOND_LETTER[move.end[0]],
      ].join(''),
    };

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
    console.log(this.log);

    this.log.forEach((v) => {
      console.log(v);
      if (v.color === COLORS.WHITE || this.winner) whiteLog.push(v);
      if (v.color === COLORS.BLACK || this.winner) blackLog.push(v);
    });

    console.log(whiteLog, blackLog);

    return [whiteLog, blackLog];
  }

  getColorsBySocket(clientId: string): string[] {
    if (clientId === this.white.socket) return [COLORS.WHITE, COLORS.BLACK];
    if (clientId === this.black.socket) return [COLORS.BLACK, COLORS.WHITE];
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
