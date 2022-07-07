import { Logger } from '@nestjs/common';
import { validCoordinate } from '../../helpers/validation';
import {
  WHITE_FIGURES,
  BLACK_FIGURES,
  FIGURES,
  FOG_BOARD,
  COLORS,
} from '../../enums/constants';
import {
  QUEEN_WAYS,
  BISHOP_WAYS,
  KNIGHTS_WAYS,
  ROOK_WAYS,
  WHITE_PAWN_WAYS,
  BLACK_PAWN_WAYS,
  KING_WAYS,
  KING_WAYS_CASTLING,
} from '../../enums/figureWays';
import { Game } from '../../models/game.model';
import {
  CheckWaysPropsType,
  CreateBoardsForPlayersType,
  MoveType,
} from '../../types';

export class FogBoardService {
  private logger = new Logger(FogBoardService.name);

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
            playerColor: COLORS.BLACK,
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
    initWhiteWays.forEach((way) => whiteWays.push(this.createWay(way)));
    initBlackWays.forEach((way) => blackWays.push(this.createWay(way)));

    return {
      whiteBoard,
      blackBoard,
      whiteWays,
      blackWays,
    };
  }

  createWays(game: Game) {
    const initWhiteWays = [];
    const initBlackWays = [];
    const whiteKingWays = [];
    const blackKingWays = [];

    game.board.forEach((v, checkRow) => {
      v.forEach((v, checkCol) => {
        const cell = game.board[checkRow][checkCol];

        let props: CheckWaysPropsType = {
          game,
          checkRow,
          checkCol,
        };

        if (WHITE_FIGURES.includes(cell)) {
          props = {
            ...props,
            playerColor: COLORS.WHITE,
            playerWays: initWhiteWays,
            ownFigures: WHITE_FIGURES,
            ownKing: FIGURES.WHITE_KING,
            pawnWays: WHITE_PAWN_WAYS,
            kingWays: whiteKingWays,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          props = {
            ...props,
            playerColor: COLORS.BLACK,
            playerWays: initBlackWays,
            ownFigures: BLACK_FIGURES,
            ownKing: FIGURES.BLACK_KING,
            pawnWays: BLACK_PAWN_WAYS,
            kingWays: blackKingWays,
          };
        }

        this.checkKingWays(props);
      });
    });

    game.board.forEach((v, checkRow) => {
      v.forEach((v, checkCol) => {
        const cell = game.board[checkRow][checkCol];

        let props: CheckWaysPropsType = {
          game,
          checkRow,
          checkCol,
        };

        if (WHITE_FIGURES.includes(cell)) {
          props = {
            ...props,
            playerColor: COLORS.WHITE,
            playerWays: initWhiteWays,
            ownFigures: WHITE_FIGURES,
            ownKing: FIGURES.WHITE_KING,
            pawnWays: WHITE_PAWN_WAYS,
            kingWays: whiteKingWays,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          props = {
            ...props,
            playerColor: COLORS.BLACK,
            playerWays: initBlackWays,
            ownFigures: BLACK_FIGURES,
            ownKing: FIGURES.BLACK_KING,
            pawnWays: BLACK_PAWN_WAYS,
            kingWays: blackKingWays,
          };
        }

        switch (true) {
          // case cell.toLowerCase() === FIGURES.BLACK_KING:
          //   this.checkKingWays(props);
          //   break;

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

    // this.checkInterceptionWays(game, 'white', whiteBoard, initWhiteWays);
    // this.checkInterceptionWays(game, 'black', blackBoard, initBlackWays);
    const whiteWays: string[] = [];
    const blackWays: string[] = [];
    initWhiteWays.forEach((way) => whiteWays.push(this.createWay(way)));
    initBlackWays.forEach((way) => blackWays.push(this.createWay(way)));

    return {
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

      const isCorrectCoordinates = validCoordinate(wayRow, wayCol);

      if (isCorrectCoordinates)
        this.addWayAndVisibility({ ...props, wayRow, wayCol });
    });

    this.checkCastling(props);
  };

  private checkKnightWays = (
    props: CheckWaysPropsType,
    figureWays: number[][],
  ) => {
    const { checkRow, checkCol } = props;

    figureWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates = validCoordinate(wayRow, wayCol);

      if (isCorrectCoordinates)
        this.addWayAndVisibility({ ...props, wayRow, wayCol });
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

          if (validCoordinate(wayRow, wayCol)) {
            this.addWayAndVisibility({ ...props, side, wayRow, wayCol, i });

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

      const isCorrectCoordinates = validCoordinate(wayRow, wayCol);

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
          this.addWayAndVisibility({ ...props, wayRow, wayCol });
      }
    });
  }

  private createWay(way: number[][]) {
    return [way[0][0], way[0][1], way[1][0], way[1][1]].join('');
  }

  private addWayAndVisibility(props) {
    const {
      game,
      playerBoard,
      wayRow,
      wayCol,
      ownFigures,
      playerWays,
      checkRow,
      checkCol,
    } = props;

    playerBoard[wayRow][wayCol] = game.board[wayRow][wayCol];
    const endFigure = game.board[wayRow][wayCol];

    const isOwnFigure = ownFigures.includes(endFigure);

    if (!isOwnFigure) {
      playerWays.push([
        [checkRow, checkCol],
        [wayRow, wayCol],
      ]);
    }
  }

  private checkCastling(props: CheckWaysPropsType) {
    const { game, playerColor, playerWays, checkRow, checkCol } = props;

    const castling =
      playerColor === COLORS.WHITE
        ? game.white.rules.castling
        : game.black.rules.castling;

    if (castling) {
      const isLongCastling = this.checkCastlingSide(
        props,
        KING_WAYS_CASTLING.TO_LONG_SIDE,
        castling.long,
      );

      if (isLongCastling && castling.long) {
        playerWays.push([
          [checkRow, checkCol],
          [checkRow, 2],
        ]);
      }
    }

    if (castling) {
      const isShortCastling = this.checkCastlingSide(
        props,
        KING_WAYS_CASTLING.TO_SHORT_SIDE,
        castling.short,
      );

      if (isShortCastling && castling.short) {
        playerWays.push([
          [checkRow, checkCol],
          [checkRow, 6],
        ]);
      }
    }
  }

  private checkCastlingSide(
    props: CheckWaysPropsType,
    side,
    isCastlingSide,
  ): boolean {
    const { checkRow, checkCol, game, playerBoard, playerColor } = props;

    if (!isCastlingSide) return;

    const initPos = playerColor === COLORS.WHITE ? [7, 4] : [0, 4];
    if (checkRow !== initPos[0] || checkCol !== initPos[1]) return false;

    let isCastling = true;

    side.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      if (validCoordinate(wayRow, wayCol)) {
        const isCellNotEmpty = game.board[wayRow][wayCol] !== FIGURES.EMPTY;

        if (isCellNotEmpty) isCastling = false;
      }
    });

    if (isCastling) {
      side.forEach((way) => {
        const wayRow = checkRow + way[0];
        const wayCol = checkCol + way[1];
        playerBoard[wayRow][wayCol] = game.board[wayRow][wayCol];
      });
    }

    return isCastling;
  }
}