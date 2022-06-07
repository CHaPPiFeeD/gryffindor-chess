import { Logger } from '@nestjs/common';
import { checkCoordinates } from '../../helpers/validation';
import {
  addWayAndVisibility,
  checkCastling,
  createWay,
} from '../../helpers/board';
import {
  WHITE_FIGURES,
  BLACK_FIGURES,
  FIGURES,
  FOG_BOARD,
  COLORS,
} from '../../enum/constants';
import {
  QUEEN_WAYS,
  BISHOP_WAYS,
  KNIGHTS_WAYS,
  ROOK_WAYS,
  WHITE_PAWN_WAYS,
  BLACK_PAWN_WAYS,
  KING_WAYS,
} from '../../enum/figureWays';
import { Game } from 'src/models/game.model';
import {
  CheckWaysPropsType,
  CreateBoardsForPlayersType,
  MoveType,
} from 'src/types';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createFogBoards(game: Game): CreateBoardsForPlayersType {
    const whiteBoard = FOG_BOARD();
    const blackBoard = FOG_BOARD();
    const initWhiteWays = [];
    const initBlackWays = [];

    game.board.forEach((v, checkRow) => {
      v.forEach((v, checkCol) => {
        const cell = game.board[checkRow][checkCol];

        let props: CheckWaysPropsType = {
          game,
          checkRow,
          checkCol,
        };

        if (WHITE_FIGURES.includes(cell)) {
          whiteBoard[checkRow][checkCol] = cell;

          props = {
            ...props,
            playerColor: COLORS.WHITE,
            playerBoard: whiteBoard,
            playerWays: initWhiteWays,
            ownFigures: WHITE_FIGURES,
            ownKing: FIGURES.WHITE_KING,
            pawnWays: WHITE_PAWN_WAYS,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          blackBoard[checkRow][checkCol] = cell;

          props = {
            ...props,
            playerBoard: blackBoard,
            playerWays: initBlackWays,
            ownFigures: BLACK_FIGURES,
            ownKing: FIGURES.BLACK_KING,
            pawnWays: BLACK_PAWN_WAYS,
          };
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.BLACK_KING:
            this.checkKingWays(props);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_QUEEN:
            this.checkWays(props, QUEEN_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_BISHOP:
            this.checkWays(props, BISHOP_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_KNIGHT:
            this.checkKnightWays(props, KNIGHTS_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_ROOK:
            this.checkWays(props, ROOK_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_PAWN:
            this.checkPawnWays(props);
            break;
        }
      });
    });

    this.checkInterceptionWays(game, 'white', whiteBoard, initWhiteWays);
    this.checkInterceptionWays(game, 'black', blackBoard, initBlackWays);

    const whiteWays: string[] = [];
    const blackWays: string[] = [];

    initWhiteWays.forEach((way) => whiteWays.push(createWay(way)));
    initBlackWays.forEach((way) => blackWays.push(createWay(way)));

    return {
      whiteBoard,
      blackBoard,
      whiteWays,
      blackWays,
    };
  }

  getLastMove = (
    whiteBoard: string[][],
    blackBoard: string[][],
    move: MoveType,
  ) => {
    const white = [];
    const black = [];

    if (whiteBoard[move.start[0]][move.start[1]] !== FIGURES.FOG)
      white.push([move.start[0], move.start[1]]);

    if (whiteBoard[move.end[0]][move.end[1]] !== FIGURES.FOG)
      white.push([move.end[0], move.end[1]]);

    if (blackBoard[move.start[0]][move.start[1]] !== FIGURES.FOG)
      black.push([move.start[0], move.start[1]]);

    if (blackBoard[move.end[0]][move.end[1]] !== FIGURES.FOG)
      black.push([move.end[0], move.end[1]]);

    return { white, black };
  };

  private checkInterceptionWays = (
    game: Game,
    color: string,
    board: string[][],
    ways: number[][][],
  ) => {
    game[color].rules.interception?.forEach((v) => {
      ways.push([
        [v.move.start[0], v.move.start[1]],
        [v.move.end[0], v.move.end[1]],
      ]);

      board[v.move.end[0]][v.move.end[1]] =
        game.board[v.move.end[0]][v.move.end[1]];

      board[v.figurePosition[0]][v.figurePosition[1]] =
        game.board[v.figurePosition[0]][v.figurePosition[1]];
    });
  };

  private checkKingWays = (props: CheckWaysPropsType) => {
    const { checkRow, checkCol } = props;

    KING_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates)
        addWayAndVisibility({ ...props, wayRow, wayCol });
    });

    checkCastling(props);
  };

  private checkKnightWays = (
    props: CheckWaysPropsType,
    figureWays: number[][],
  ) => {
    const { checkRow, checkCol } = props;

    figureWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates)
        addWayAndVisibility({ ...props, wayRow, wayCol });
    });
  };

  private checkWays(props: CheckWaysPropsType, figureWays: number[][][]) {
    const { game, checkRow, checkCol } = props;

    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way, i) => {
        if (isSide) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          if (checkCoordinates(wayRow, wayCol)) {
            addWayAndVisibility({ ...props, side, wayRow, wayCol, i });

            if (game.board[wayRow][wayCol] !== FIGURES.EMPTY) isSide = false;
          } else isSide = false;
        }
      });
    });
  }

  private checkPawnWays(props: CheckWaysPropsType) {
    const { game, checkRow, checkCol, pawnWays } = props;
    const initPosPawn = pawnWays === WHITE_PAWN_WAYS ? 6 : 1;

    pawnWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const step = pawnWays === WHITE_PAWN_WAYS ? wayRow + 1 : wayRow - 1;

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates) {
        const isStep =
          Math.abs(way[0]) === 1 &&
          Math.abs(way[1]) === 0 &&
          game.board[wayRow][wayCol] === FIGURES.EMPTY;

        const isDiagonal =
          Math.abs(way[1]) === 1 &&
          game.board[wayRow][wayCol] !== FIGURES.EMPTY;

        const isTwoSteps =
          checkRow === initPosPawn &&
          Math.abs(way[0]) === 2 &&
          Math.abs(way[1]) === 0 &&
          game.board[wayRow][wayCol] === FIGURES.EMPTY &&
          game.board[step][wayCol] === FIGURES.EMPTY;

        if (isDiagonal || isStep || isTwoSteps)
          addWayAndVisibility({ ...props, wayRow, wayCol });
      }
    });
  }
}
