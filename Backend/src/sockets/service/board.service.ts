import { Logger } from '@nestjs/common';
import { createWay } from 'src/helpers';
import {
  BLACK_FIGURES,
  FIGURES,
  FIGURES_COLORS,
  FOG_BOARD,
  WHITE_FIGURES,
} from '../../enum/constants';
import {
  BISHOP_WAYS,
  BLACK_PAWN_WAYS,
  KING_WAYS,
  KNIGHTS_WAYS,
  QUEEN_WAYS,
  ROOK_WAYS,
  WHITE_PAWN_WAYS,
} from '../../enum/figureWays';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createBoardsForPlayers(board: string[][]): any {
    const start = new Date();
    const whiteBoard = FOG_BOARD();
    const blackBoard = FOG_BOARD();
    const initWhiteWays = [];
    const initBlackWays = [];

    board.forEach((rowValue, checkRow) => {
      rowValue.forEach((colValue, checkCol) => {
        const cell = board[checkRow][checkCol];
        let selectBoard;
        let selectWays;
        let figuresString;

        if (WHITE_FIGURES.includes(cell)) {
          whiteBoard[checkRow][checkCol] = cell;
          selectBoard = whiteBoard;
          selectWays = initWhiteWays;
          figuresString = WHITE_FIGURES;
        }

        if (BLACK_FIGURES.includes(cell)) {
          blackBoard[checkRow][checkCol] = cell;
          selectBoard = blackBoard;
          selectWays = initBlackWays;
          figuresString = BLACK_FIGURES;
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.QUEEN:
            this.checkWays(
              board,
              selectBoard,
              checkRow,
              checkCol,
              selectWays,
              QUEEN_WAYS,
              figuresString,
            );
            break;

          case cell.toLowerCase() === FIGURES.BISHOP:
            this.checkWays(
              board,
              selectBoard,
              checkRow,
              checkCol,
              selectWays,
              BISHOP_WAYS,
              figuresString,
            );
            break;

          case cell.toLowerCase() === FIGURES.KNIGHT:
            this.checkKnightWays(
              board,
              selectBoard,
              checkRow,
              checkCol,
              selectWays,
              figuresString,
            );
            break;

          case cell.toLowerCase() === FIGURES.ROOK:
            this.checkWays(
              board,
              selectBoard,
              checkRow,
              checkCol,
              selectWays,
              ROOK_WAYS,
              figuresString,
            );
            break;

          case cell === FIGURES_COLORS.WHITE.PAWN:
            this.checkPawnWays(
              board,
              selectBoard,
              checkRow,
              checkCol,
              selectWays,
              WHITE_PAWN_WAYS,
              figuresString,
            );
            break;

          case cell === FIGURES_COLORS.BLACK.PAWN:
            this.checkPawnWays(
              board,
              selectBoard,
              checkRow,
              checkCol,
              selectWays,
              BLACK_PAWN_WAYS,
              figuresString,
            );
            break;
        }
      });
    });

    board.forEach((rowValue, row) => {
      rowValue.forEach((colValue, col) => {
        const cell = board[row][col];

        if (cell === FIGURES_COLORS.WHITE.KING) {
          whiteBoard[row][col] = cell;
          this.checkKingWays(
            board,
            whiteBoard,
            row,
            col,
            initWhiteWays,
            initBlackWays,
            WHITE_FIGURES,
          );
        }

        if (cell === FIGURES_COLORS.BLACK.KING) {
          blackBoard[row][col] = cell;
          this.checkKingWays(
            board,
            blackBoard,
            row,
            col,
            initBlackWays,
            initWhiteWays,
            BLACK_FIGURES,
          );
        }
      });
    });

    const end = new Date();
    this.logger.warn(+end - +start);

    const whiteWays = [];
    const blackWays = [];

    initWhiteWays.forEach((way) => {
      whiteWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    initBlackWays.forEach((way) => {
      blackWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    return { whiteBoard, blackBoard, whiteWays, blackWays };
  }

  checkKnightWays(
    generalBoard: string[][],
    playerBoard: string[][],
    checkRow: number,
    checkCol: number,
    playerWays: number[][][],
    ownFigures: string,
  ) {
    KNIGHTS_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates =
        wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8;

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

  checkWays(
    generalBoard: string[][],
    playerBoard: string[][],
    checkRow: number,
    checkCol: number,
    playerWays: number[][][],
    figureWays: number[][][],
    ownFigures: string,
  ) {
    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way) => {
        if (isSide) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          const isCorrectCoordinates =
            wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8;

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

  checkPawnWays(
    generalBoard: string[][],
    playerBoard: string[][],
    checkRow: number,
    checkCol: number,
    playerWays: number[][][],
    figureWays: number[][][],
    ownFigures: string,
  ) {
    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way) => {
        if (isSide) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          const isCorrectCoordinates =
            wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8;

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

  checkKingWays(
    generalBoard: string[][],
    playerBoard: string[][],
    checkRow: number,
    checkCol: number,
    playerWays: number[][][],
    anotherPlayerWays: number[][][],
    ownFigures: string,
  ) {
    const kingInitWays = [];

    KING_WAYS.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates =
        wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8;

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
