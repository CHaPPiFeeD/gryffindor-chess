import { Logger } from '@nestjs/common';
import { validCoordinate } from '../../helpers/validation';
import { Game } from '../../models/game.model';
import { CreateWaysPropsType, GamePlayerType } from '../../types';
import {
  WHITE_FIGURES,
  BLACK_FIGURES,
  FIGURES,
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
import { WsException } from '@nestjs/websockets';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createWays(game: Game, clientSocketId?: string) {
    const [clientColor, opponentColor] = game.getColorsBySocket(clientSocketId);

    const data = this.createData(game);

    if (data[opponentColor].rules.check) {
      this.clearWaysCheck(game, data, opponentColor);
    }

    if (data[opponentColor].ways.length === 0) game.gameEnd = new Date();

    if (data[clientColor].rules.check)
      throw new WsException('Your king is under attack');

    game.white.ways = data.white.ways;
    game.black.ways = data.black.ways;
    game.white.rules.check = data.white.rules.check;
    game.black.rules.check = data.black.rules.check;

    return { whiteWays: data.white.ways, blackWays: data.black.ways };
  }

  private clearWaysCheck(game: Game, data: any, color: string) {
    const deleteWays = [];

    data[color].ways.forEach((way) => {
      const copyGame = JSON.parse(JSON.stringify(game));
      const wayArray = way.split('');

      const move = {
        start: [wayArray[0], wayArray[1]],
        end: [wayArray[2], wayArray[3]],
      };

      copyGame.board[move.end[0]][move.end[1]] =
        copyGame.board[move.start[0]][move.start[1]];

      copyGame.board[move.start[0]][move.start[1]] = FIGURES.EMPTY;

      const wayData = this.createData(copyGame);
      if (wayData[color].rules.check) deleteWays.push(way);
    });

    deleteWays.forEach((way) => {
      const index = data[color].ways.findIndex((dataWay) => way === dataWay);
      if (index >= 0) data[color].ways.splice(index, 1);
    });

    // if (data[color].ways.length === 0) game.gameEnd = new Date();
  }

  private createData(game: Game) {
    const data = {
      white: {
        initWays: {
          king: [],
          figures: [],
        },
        ways: [],
        rules: {
          check: false,
        },
      },
      black: {
        initWays: {
          king: [],
          figures: [],
        },
        ways: [],
        rules: {
          check: false,
        },
      },
    };

    this.addKingsWays(game, data);
    this.createOtherFiguresWays(game, data);

    data.white.initWays.king.forEach((way) =>
      data.white.ways.push(this.createWay(way)),
    );
    data.black.initWays.king.forEach((way) =>
      data.black.ways.push(this.createWay(way)),
    );
    data.white.initWays.figures.forEach((way) =>
      data.white.ways.push(this.createWay(way)),
    );
    data.black.initWays.figures.forEach((way) =>
      data.black.ways.push(this.createWay(way)),
    );

    delete data.white.initWays;
    delete data.black.initWays;

    return data;
  }

  private addKingsWays(game: Game, data) {
    const initWhiteKingWays = [];
    const initBlackKingWays = [];

    game.board.forEach((v, checkRow) => {
      v.forEach((v, checkCol) => {
        const cell = game.board[checkRow][checkCol];

        if (cell === FIGURES.WHITE_KING) {
          const props: CreateWaysPropsType = {
            game,
            checkRow,
            checkCol,
            kingWays: initWhiteKingWays,
            figures: WHITE_FIGURES,
            color: COLORS.WHITE,
          };
          this.checkKingWays(props);
        }

        if (cell === FIGURES.BLACK_KING) {
          const props: CreateWaysPropsType = {
            game,
            checkRow,
            checkCol,
            kingWays: initBlackKingWays,
            figures: BLACK_FIGURES,
            color: COLORS.BLACK,
          };
          this.checkKingWays(props);
        }
      });
    });

    data.white.initWays.king = this.clearKingWays(
      initWhiteKingWays,
      initBlackKingWays,
    );

    data.black.initWays.king = this.clearKingWays(
      initBlackKingWays,
      initWhiteKingWays,
    );
  }

  private checkKingWays(props: CreateWaysPropsType) {
    const { checkRow, checkCol, kingWays, game, figures } = props;

    KING_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      if (validCoordinate(wayRow, wayCol)) {
        const endFigure = game.board[wayRow][wayCol];
        const isOwnFigure = figures.includes(endFigure);

        if (!isOwnFigure) {
          kingWays.push([
            [checkRow, checkCol],
            [wayRow, wayCol],
          ]);
        }
      }
    });

    this.checkCastling(props);
  }

  private clearKingWays(
    initWays: number[][][],
    initOpponentWays: number[][][],
  ): number[][][] {
    const ways = [];

    initWays.forEach((wayBlack) => {
      let isAccessWay = true;

      initOpponentWays.forEach((wayWhite) => {
        const isIdenticalWay =
          wayWhite[1][0] === wayBlack[1][0] &&
          wayWhite[1][1] === wayBlack[1][1];

        if (isIdenticalWay) isAccessWay = false;
      });

      if (isAccessWay) ways.push(wayBlack);
    });

    return ways;
  }

  private createOtherFiguresWays(game: Game, data) {
    game.board.forEach((v, checkRow) => {
      v.forEach((v, checkCol) => {
        const cell = game.board[checkRow][checkCol];

        let props: CreateWaysPropsType = {
          game,
          checkRow,
          checkCol,
          data,
        };

        if (WHITE_FIGURES.includes(cell)) {
          props = {
            ...props,
            color: COLORS.WHITE,
            ways: data.white.initWays.figures,
            figures: WHITE_FIGURES,
            king: FIGURES.WHITE_KING,
            pawnWays: WHITE_PAWN_WAYS,
            opponentsKing: FIGURES.BLACK_KING,
            opponentsKingsWays: data.black.initWays.king,
            opponentsColor: COLORS.BLACK,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          props = {
            ...props,
            color: COLORS.BLACK,
            ways: data.black.initWays.figures,
            figures: BLACK_FIGURES,
            king: FIGURES.BLACK_KING,
            pawnWays: BLACK_PAWN_WAYS,
            opponentsKing: FIGURES.WHITE_KING,
            opponentsKingsWays: data.white.initWays.king,
            opponentsColor: COLORS.WHITE,
          };
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.BLACK_QUEEN:
            this.checkWays(props, QUEEN_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_BISHOP:
            this.checkWays(props, BISHOP_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BLACK_KNIGHT:
            this.checkKnightWays(props);
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

    this.addInterceptionWays(game.white, data.white.initWays.figures);
    this.addInterceptionWays(game.black, data.black.initWays.figures);
  }

  // TODO not working getLastMove function
  // getLastMove = (
  //   whiteBoard: string[][],
  //   blackBoard: string[][],
  //   move: MoveType,
  // ) => {
  //   const white = [];
  //   const black = [];

  //   if (whiteBoard[move.start[0]][move.start[1]] !== FIGURES.FOG)
  //     white.push([move.start[0], move.start[1]]);

  //   if (whiteBoard[move.end[0]][move.end[1]] !== FIGURES.FOG)
  //     white.push([move.end[0], move.end[1]]);

  //   if (blackBoard[move.start[0]][move.start[1]] !== FIGURES.FOG)
  //     black.push([move.start[0], move.start[1]]);

  //   if (blackBoard[move.end[0]][move.end[1]] !== FIGURES.FOG)
  //     black.push([move.end[0], move.end[1]]);

  //   return { white, black };
  // };

  private addInterceptionWays = (
    gamePlayer: GamePlayerType,
    ways: number[][][],
  ) => {
    gamePlayer.rules.interception?.forEach((v) => {
      ways.push([
        [v.move.start[0], v.move.start[1]],
        [v.move.end[0], v.move.end[1]],
      ]);
    });
  };

  private checkKnightWays(props: CreateWaysPropsType) {
    const {
      checkRow,
      checkCol,
      game,
      figures,
      ways,
      opponentsKingsWays,
      opponentsKing,
    } = props;

    KNIGHTS_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      if (validCoordinate(wayRow, wayCol)) {
        const endFigure = game.board[wayRow][wayCol];

        const isAllow =
          !figures.includes(endFigure) && endFigure !== opponentsKing;

        if (isAllow) {
          ways.push([
            [checkRow, checkCol],
            [wayRow, wayCol],
          ]);
        }

        this.deleteKingsWay(opponentsKingsWays, wayRow, wayCol);
        this.checkCheck(props, endFigure);
      }
    });
  }

  private checkCheck(props: CreateWaysPropsType, endFigure) {
    const { opponentsKing, data, opponentsColor } = props;
    if (endFigure !== opponentsKing) return;
    data[opponentsColor].rules.check = true;
  }

  private checkWays(props: CreateWaysPropsType, figureWays: number[][][]) {
    const {
      game,
      checkRow,
      checkCol,
      figures,
      ways,
      opponentsKingsWays,
      opponentsKing,
    } = props;

    figureWays.forEach((side) => {
      let isCanMove = true;

      side.forEach((way, sideIndex) => {
        if (isCanMove) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          if (validCoordinate(wayRow, wayCol)) {
            const endFigure = game.board[wayRow][wayCol];

            const isAllow =
              !figures.includes(endFigure) && endFigure !== opponentsKing;

            if (isAllow) {
              ways.push([
                [checkRow, checkCol],
                [wayRow, wayCol],
              ]);
            }

            this.deleteKingsWay(opponentsKingsWays, wayRow, wayCol);
            this.checkCheck(props, endFigure);

            if (endFigure.toLowerCase() === FIGURES.BLACK_KING) {
              const wayRow = checkRow + side[sideIndex + 1][0];
              const wayCol = checkCol + side[sideIndex + 1][1];

              this.deleteKingsWay(opponentsKingsWays, wayRow, wayCol);
            }

            if (game.board[wayRow][wayCol] !== FIGURES.EMPTY) isCanMove = false;
          } else isCanMove = false;
        }
      });
    });
  }

  private deleteKingsWay(
    kingsWays: number[][][],
    wayRow: number,
    wayCol: number,
  ): void {
    kingsWays.forEach((way, index) => {
      if (way[1][0] === wayRow && way[1][1] === wayCol) {
        kingsWays.splice(index, 1);
      }
    });
  }

  private checkPawnWays(props: CreateWaysPropsType) {
    const {
      game,
      checkRow,
      checkCol,
      pawnWays,
      figures,
      ways,
      opponentsKingsWays,
      opponentsKing,
    } = props;
    const initPosPawn = pawnWays === WHITE_PAWN_WAYS ? 6 : 1;

    pawnWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const step = pawnWays === WHITE_PAWN_WAYS ? wayRow + 1 : wayRow - 1;

      if (validCoordinate(wayRow, wayCol)) {
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

        if (isDiagonal || isStep || isTwoSteps) {
          const endFigure = game.board[wayRow][wayCol];

          const isAllow =
            !figures.includes(endFigure) && endFigure !== opponentsKing;

          if (isAllow) {
            ways.push([
              [checkRow, checkCol],
              [wayRow, wayCol],
            ]);
          }
        }

        if (Math.abs(way[1]) === 1) {
          this.deleteKingsWay(opponentsKingsWays, wayRow, wayCol);
          const endFigure = game.board[wayRow][wayCol];
          this.checkCheck(props, endFigure);
        }
      }
    });
  }

  private createWay(way: number[][]) {
    return [way[0][0], way[0][1], way[1][0], way[1][1]].join('');
  }

  private checkCastling(props: CreateWaysPropsType) {
    const { game, color, checkRow, checkCol, kingWays } = props;
    const castling = game[color].rules.castling;

    if (
      castling.long &&
      this.checkCastlingSide(props, KING_WAYS_CASTLING.TO_LONG_SIDE)
    ) {
      kingWays.push([
        [checkRow, checkCol],
        [checkRow, 2],
      ]);
    }

    if (
      castling.short &&
      this.checkCastlingSide(props, KING_WAYS_CASTLING.TO_SHORT_SIDE)
    ) {
      kingWays.push([
        [checkRow, checkCol],
        [checkRow, 6],
      ]);
    }
  }

  private checkCastlingSide(
    props: CreateWaysPropsType,
    side: number[][],
  ): boolean {
    const { checkRow, checkCol, game, color } = props;
    const initPos = color === COLORS.WHITE ? [7, 4] : [0, 4];

    if (checkRow !== initPos[0] || checkCol !== initPos[1]) return false;

    let isCastlingAccess = true;

    side.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      if (validCoordinate(wayRow, wayCol)) {
        if (game.board[wayRow][wayCol] !== FIGURES.EMPTY)
          isCastlingAccess = false;
      }
    });

    return isCastlingAccess;
  }
}
