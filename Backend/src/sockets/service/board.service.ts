import { Logger } from '@nestjs/common';
import {
  checkWaysPropsType,
  createBoardsForPlayersType,
} from '../../dto/board.dto';
import { createWay } from 'src/helpers';
import { checkCoordinates } from 'src/helpers/validation';
import {
  WHITE_FIGURES,
  BLACK_FIGURES,
  FIGURES,
  FIGURES_COLORS,
  FOG_BOARD,
} from '../../enum/constants';
import {
  KING_WAYS,
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

    board.forEach((rowValue, checkRow) => {
      rowValue.forEach((colValue, checkCol) => {
        const cell = board[checkRow][checkCol];
        let props;

        if (cell === FIGURES_COLORS.WHITE.KING) {
          whiteBoard[checkRow][checkCol] = cell;

          props = {
            generalBoard: board,
            playerBoard: whiteBoard,
            checkRow,
            checkCol,
            playerWays: initWhiteWays,
            anotherPlayerWays: initBlackWays,
            ownFigures: WHITE_FIGURES,
          };

          this.checkKingWays(props);
        }

        if (cell === FIGURES_COLORS.BLACK.KING) {
          blackBoard[checkRow][checkCol] = cell;

          props = {
            generalBoard: board,
            playerBoard: blackBoard,
            checkRow,
            checkCol,
            playerWays: initBlackWays,
            anotherPlayerWays: initWhiteWays,
            ownFigures: BLACK_FIGURES,
          };

          this.checkKingWays(props);
        }
      });
    });

    const end = new Date();
    this.logger.warn(+end - +start);

    const whiteWays: string[] = [];
    const blackWays: string[] = [];

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

      side.forEach((way) => {
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

      side.forEach((way) => {
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

            if (isCellNotEmpty) isSide = false;
          } else isSide = false;
        }
      });
    });
  }

  checkKingWays(props: checkWaysPropsType) {
    const {
      generalBoard,
      playerBoard,
      checkRow,
      checkCol,
      playerWays,
      anotherPlayerWays,
      ownFigures,
    } = props;

    const kingInitWays = [];

    KING_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates) {
        playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];

        const isOwnFigure = ownFigures.includes(generalBoard[wayRow][wayCol]);

        if (!isOwnFigure) kingInitWays.push([wayRow, wayCol]);
      }
    });

    anotherPlayerWays.forEach((anotherPlayerWay) => {
      kingInitWays.forEach((kingWay, i) => {
        const isIdenticalCells =
          anotherPlayerWay[1][0] === kingWay[0] &&
          anotherPlayerWay[1][1] === kingWay[1];

        if (isIdenticalCells) kingInitWays.splice(i, 1);
      });
    });

    kingInitWays.forEach((way) => {
      playerWays.push([
        [checkRow, checkCol],
        [way[0], way[1]],
      ]);
    });
  }
}
