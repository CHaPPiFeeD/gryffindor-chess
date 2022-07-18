import { Logger } from '@nestjs/common';
import { validCoordinate } from '../../helpers/validation';
import { Game } from '../../models/game.model';
import { CreateWaysPropsType } from '../../types';
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

export class BoardService {
  private logger = new Logger(BoardService.name);

  createWays(game: Game) {
    const initWhiteWays = [];
    const initBlackWays = [];
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

    const whiteKingWays = [];
    const blackKingWays = [];

    initWhiteKingWays.forEach((wayWhite) => {
      let isAccessWay = true;

      initBlackKingWays.forEach((wayBlack) => {
        const isIdenticalWay =
          wayBlack[1][0] === wayWhite[1][0] &&
          wayBlack[1][1] === wayWhite[1][1];

        if (isIdenticalWay) isAccessWay = false;
      });

      if (isAccessWay) whiteKingWays.push(wayWhite);
    });

    initBlackKingWays.forEach((wayBlack) => {
      let isAccessWay = true;

      initWhiteKingWays.forEach((wayWhite) => {
        const isIdenticalWay =
          wayWhite[1][0] === wayBlack[1][0] &&
          wayWhite[1][1] === wayBlack[1][1];

        if (isIdenticalWay) isAccessWay = false;
      });

      if (isAccessWay) blackKingWays.push(wayBlack);
    });

    game.board.forEach((v, checkRow) => {
      v.forEach((v, checkCol) => {
        const cell = game.board[checkRow][checkCol];

        let props: CreateWaysPropsType = {
          game,
          checkRow,
          checkCol,
        };

        if (WHITE_FIGURES.includes(cell)) {
          props = {
            ...props,
            color: COLORS.WHITE,
            ways: initWhiteWays,
            figures: WHITE_FIGURES,
            king: FIGURES.WHITE_KING,
            pawnWays: WHITE_PAWN_WAYS,
            opponentsKingsWays: blackKingWays,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          props = {
            ...props,
            color: COLORS.BLACK,
            ways: initBlackWays,
            figures: BLACK_FIGURES,
            king: FIGURES.BLACK_KING,
            pawnWays: BLACK_PAWN_WAYS,
            opponentsKingsWays: whiteKingWays,
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

    this.checkInterceptionWays(game, 'white', initWhiteWays);
    this.checkInterceptionWays(game, 'black', initBlackWays);

    const whiteWays: string[] = [];
    const blackWays: string[] = [];

    whiteKingWays.forEach((way) => whiteWays.push(this.createWay(way)));
    blackKingWays.forEach((way) => blackWays.push(this.createWay(way)));
    initWhiteWays.forEach((way) => whiteWays.push(this.createWay(way)));
    initBlackWays.forEach((way) => blackWays.push(this.createWay(way)));

    game.white.ways = whiteWays;
    game.black.ways = blackWays;

    return { whiteWays, blackWays };
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

  private checkInterceptionWays = (
    game: Game,
    color: string,
    ways: number[][][],
  ) => {
    game[color].rules.interception?.forEach((v) => {
      ways.push([
        [v.move.start[0], v.move.start[1]],
        [v.move.end[0], v.move.end[1]],
      ]);
    });
  };

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

  private checkKnightWays(props: CreateWaysPropsType) {
    const { checkRow, checkCol, game, figures, ways, opponentsKingsWays } =
      props;

    KNIGHTS_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      if (validCoordinate(wayRow, wayCol)) {
        const endFigure = game.board[wayRow][wayCol];

        const isOwnFigure = figures.includes(endFigure);

        if (!isOwnFigure) {
          ways.push([
            [checkRow, checkCol],
            [wayRow, wayCol],
          ]);
        }

        opponentsKingsWays.forEach((way, index) => {
          if (way[1][0] === wayRow && way[1][1] === wayCol) {
            opponentsKingsWays.splice(index, 1);
          }
        });
      }
    });
  }

  private checkWays(props: CreateWaysPropsType, figureWays: number[][][]) {
    const { game, checkRow, checkCol, figures, ways, opponentsKingsWays } =
      props;

    figureWays.forEach((side) => {
      let isCanMove = true;

      side.forEach((way, sideIndex) => {
        if (isCanMove) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          if (validCoordinate(wayRow, wayCol)) {
            const endFigure = game.board[wayRow][wayCol];
            const isOwnFigure = figures.includes(endFigure);

            if (!isOwnFigure) {
              ways.push([
                [checkRow, checkCol],
                [wayRow, wayCol],
              ]);
            }

            opponentsKingsWays.forEach((way, index) => {
              if (way[1][0] === wayRow && way[1][1] === wayCol) {
                opponentsKingsWays.splice(index, 1);
              }
            });

            if (endFigure.toLowerCase() === FIGURES.BLACK_KING) {
              const wayRow = checkRow + side[sideIndex + 1][0];
              const wayCol = checkCol + side[sideIndex + 1][1];

              opponentsKingsWays.forEach((way, index) => {
                if (way[1][0] === wayRow && way[1][1] === wayCol) {
                  opponentsKingsWays.splice(index, 1);
                }
              });
            }

            if (game.board[wayRow][wayCol] !== FIGURES.EMPTY) isCanMove = false;
          } else isCanMove = false;
        }
      });
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

          const isOwnFigure = figures.includes(endFigure);

          if (!isOwnFigure) {
            ways.push([
              [checkRow, checkCol],
              [wayRow, wayCol],
            ]);
          }
        }

        if (Math.abs(way[1]) === 1) {
          opponentsKingsWays.forEach((way, index) => {
            if (way[1][0] === wayRow && way[1][1] === wayCol) {
              opponentsKingsWays.splice(index, 1);
            }
          });
        }
      }
    });
  }

  private createWay(way: number[][]) {
    return [way[0][0], way[0][1], way[1][0], way[1][1]].join('');
  }

  private checkCastling(props: CreateWaysPropsType) {
    const { game, color, checkRow, checkCol, kingWays } = props;

    const castling =
      color === COLORS.WHITE
        ? game.white.rules.castling
        : game.black.rules.castling;

    const isLongCastling = this.checkCastlingSide(
      props,
      KING_WAYS_CASTLING.TO_LONG_SIDE,
      castling.long,
    );

    if (isLongCastling && castling.long) {
      kingWays.push([
        [checkRow, checkCol],
        [checkRow, 2],
      ]);
    }

    const isShortCastling = this.checkCastlingSide(
      props,
      KING_WAYS_CASTLING.TO_SHORT_SIDE,
      castling.short,
    );

    if (isShortCastling && castling.short) {
      kingWays.push([
        [checkRow, checkCol],
        [checkRow, 6],
      ]);
    }
  }

  private checkCastlingSide(
    props: CreateWaysPropsType,
    side: number[][],
    isCastlingSide: boolean,
  ): boolean {
    const { checkRow, checkCol, game, color } = props;

    if (!isCastlingSide) return;

    const initPos = color === COLORS.WHITE ? [7, 4] : [0, 4];
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

    return isCastling;
  }
}
