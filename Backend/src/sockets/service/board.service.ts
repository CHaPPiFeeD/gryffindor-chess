import { Logger } from '@nestjs/common';
import { checkKingWays, createKingWays, createWay } from 'src/helpers';
import { checkCoordinates } from '../../helpers/validation';
import {
  checkWaysPropsType,
  createBoardsForPlayersType,
} from '../../dto/board.dto';
import {
  WHITE_FIGURES,
  BLACK_FIGURES,
  FIGURES,
  FIGURES_COLORS,
  FOG_BOARD,
} from '../../enum/constants';
import {
  QUEEN_WAYS,
  BISHOP_WAYS,
  KNIGHTS_WAYS,
  ROOK_WAYS,
  WHITE_PAWN_WAYS,
  BLACK_PAWN_WAYS,
} from '../../enum/figureWays';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createBoardsForPlayers(board: string[][]): createBoardsForPlayersType {
    const start = new Date();
    const whiteBoard = FOG_BOARD();
    const blackBoard = FOG_BOARD();
    const initWhiteWays = [];
    const initBlackWays = [];
    let initWhiteKingWays: number[][] = [];
    let initBlackKingWays: number[][] = [];

    board.forEach((rowValue, checkRow) => {
      rowValue.forEach((colValue, checkCol) => {
        const cell = board[checkRow][checkCol];

        if (cell === FIGURES_COLORS.WHITE.KING) {
          const props = {
            generalBoard: board,
            playerBoard: whiteBoard,
            checkRow,
            checkCol,
            ownFigures: WHITE_FIGURES,
          };

          whiteBoard[checkRow][checkCol] = cell;
          initWhiteKingWays = createKingWays(props);
        }

        if (cell === FIGURES_COLORS.BLACK.KING) {
          const props = {
            generalBoard: board,
            playerBoard: blackBoard,
            checkRow,
            checkCol,
            ownFigures: BLACK_FIGURES,
          };

          blackBoard[checkRow][checkCol] = cell;
          initBlackKingWays = createKingWays(props);
        }
      });
    });

    board.forEach((rowValue, checkRow) => {
      rowValue.forEach((colValue, checkCol) => {
        const cell = board[checkRow][checkCol];
        let props;

        if (WHITE_FIGURES.includes(cell)) {
          whiteBoard[checkRow][checkCol] = cell;

          props = {
            generalBoard: board,
            playerBoard: whiteBoard,
            checkRow,
            checkCol,
            playerWays: initWhiteWays,
            ownFigures: WHITE_FIGURES,
            kingWays: initBlackKingWays,
            pawnWays: WHITE_PAWN_WAYS,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          blackBoard[checkRow][checkCol] = cell;

          props = {
            generalBoard: board,
            playerBoard: blackBoard,
            checkRow,
            checkCol,
            playerWays: initBlackWays,
            ownFigures: BLACK_FIGURES,
            kingWays: initWhiteKingWays,
            pawnWays: BLACK_PAWN_WAYS,
          };
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.QUEEN:
            this.checkWays(props, QUEEN_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.BISHOP:
            this.checkWays(props, BISHOP_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.KNIGHT:
            this.checkKnightWays(props, KNIGHTS_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.ROOK:
            this.checkWays(props, ROOK_WAYS);
            break;

          case cell.toLowerCase() === FIGURES.PAWN:
            this.checkPawnWays(props);
            break;
        }
      });
    });

    const end = new Date();
    this.logger.warn(+end - +start);

    const whiteWays: string[] = [];
    const blackWays: string[] = [];

    initWhiteKingWays.forEach((way) => {
      whiteWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    initBlackKingWays.forEach((way) => {
      blackWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    initWhiteWays.forEach((way) => {
      whiteWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    initBlackWays.forEach((way) => {
      blackWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    return { whiteBoard, blackBoard, whiteWays, blackWays };
  }

  checkKnightWays(props: checkWaysPropsType, figureWays: number[][]) {
    const {
      generalBoard,
      playerBoard,
      checkRow,
      checkCol,
      playerWays,
      kingWays,
      ownFigures,
    } = props;

    figureWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates) {
        playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];

        const isOwnFigure = ownFigures.includes(generalBoard[wayRow][wayCol]);

        if (!isOwnFigure) {
          playerWays.push([
            [checkRow, checkCol],
            [wayRow, wayCol],
          ]);
        }

        kingWays.forEach((way, i) => {
          if (way[1][0] === wayRow && way[1][1] === wayCol) {
            kingWays.splice(i, 1);
          }
        });
      }
    });
  }

  checkWays(props: checkWaysPropsType, figureWays: number[][][]) {
    const {
      generalBoard,
      playerBoard,
      checkRow,
      checkCol,
      playerWays,
      ownFigures,
    } = props;

    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way, i) => {
        if (isSide) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

          if (isCorrectCoordinates) {
            playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];

            const isOwnFigure = ownFigures.includes(
              generalBoard[wayRow][wayCol],
            );

            if (!isOwnFigure) {
              playerWays.push([
                [checkRow, checkCol],
                [wayRow, wayCol],
              ]);
            }

            const isCellNotEmpty =
              generalBoard[wayRow][wayCol] !== FIGURES.EMPTY;

            checkKingWays({
              ...props,
              wayRow,
              wayCol,
              side,
              i,
            });

            if (isCellNotEmpty) isSide = false;
          } else isSide = false;
        }
      });
    });
  }

  checkPawnWays(props: checkWaysPropsType) {
    const {
      generalBoard,
      playerBoard,
      checkRow,
      checkCol,
      playerWays,
      ownFigures,
      pawnWays,
    } = props;

    pawnWays.forEach((side) => {
      let isSide = true;

      side.forEach((way, i) => {
        if (isSide) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

          if (isCorrectCoordinates) {
            const isDiagonal =
              Math.abs(way[1]) === 1 &&
              generalBoard[wayRow][wayCol] !== FIGURES.EMPTY;

            const isDirect = Math.abs(way[1]) === 0;

            const isCellNotEmpty =
              generalBoard[wayRow][wayCol] !== FIGURES.EMPTY;

            if (isDiagonal || isDirect) {
              playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];

              const isOwnFigure = ownFigures.includes(
                generalBoard[wayRow][wayCol],
              );

              if (!isOwnFigure) {
                playerWays.push([
                  [checkRow, checkCol],
                  [wayRow, wayCol],
                ]);
              }
            }

            checkKingWays({
              ...props,
              wayRow,
              wayCol,
              side,
              i,
            });

            if (isCellNotEmpty) isSide = false;
          } else isSide = false;
        }
      });
    });
  }
}
