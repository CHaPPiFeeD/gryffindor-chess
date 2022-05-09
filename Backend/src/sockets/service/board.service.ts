import { Logger } from '@nestjs/common';
import { createWay } from 'src/helpers';
import { FIGURES, FIGURES_COLORS, FOG_BOARD } from '../../enum/constants';
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

    board.forEach((row, checkRowIndex) => {
      row.forEach((column, checkColIndex) => {
        const cell = board[checkRowIndex][checkColIndex];
        let selectBoard;
        let selectWays;
        let figuresString;

        if ('QBNRP'.includes(cell)) {
          whiteBoard[checkRowIndex][checkColIndex] = cell;
          selectBoard = whiteBoard;
          selectWays = initWhiteWays;
          figuresString = 'KQBNRP';
        }

        if ('qbnrp'.includes(cell)) {
          blackBoard[checkRowIndex][checkColIndex] = cell;
          selectBoard = blackBoard;
          selectWays = initBlackWays;
          figuresString = 'kqbnrp';
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.QUEEN:
            this.checkWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              QUEEN_WAYS,
              figuresString,
            );
            break;

          case cell.toLowerCase() === FIGURES.BISHOP:
            this.checkWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              BISHOP_WAYS,
              figuresString,
            );
            break;

          case cell.toLowerCase() === FIGURES.KNIGHT:
            this.checkKnightWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              figuresString,
            );
            break;

          case cell.toLowerCase() === FIGURES.ROOK:
            this.checkWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              ROOK_WAYS,
              figuresString,
            );
            break;

          case cell === FIGURES_COLORS.WHITE.PAWN:
            this.checkPawnWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              WHITE_PAWN_WAYS,
              figuresString,
            );
            break;

          case cell === FIGURES_COLORS.BLACK.PAWN:
            this.checkPawnWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              BLACK_PAWN_WAYS,
              figuresString,
            );
            break;

          default:
            break;
        }
      });
    });

    board.forEach((row, checkRowIndex) => {
      row.forEach((column, checkColIndex) => {
        const cell = board[checkRowIndex][checkColIndex];

        if (cell === FIGURES_COLORS.WHITE.KING) {
          whiteBoard[checkRowIndex][checkColIndex] = cell;
          this.checkKingWays(
            board,
            whiteBoard,
            checkRowIndex,
            checkColIndex,
            initWhiteWays,
            initBlackWays,
            'KQBNRP',
          );
        }

        if (cell === FIGURES_COLORS.BLACK.KING) {
          blackBoard[checkRowIndex][checkColIndex] = cell;
          this.checkKingWays(
            board,
            blackBoard,
            checkRowIndex,
            checkColIndex,
            initBlackWays,
            initWhiteWays,
            'kqbnrp',
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
    generalBoard,
    playerBoard,
    checkRowIndex,
    checkColIndex,
    playerWays,
    figuresString,
  ) {
    KNIGHTS_WAYS.forEach((way) => {
      const wayRow = checkRowIndex + way[0];
      const wayCol = checkColIndex + way[1];

      if (wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8) {
        playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
        if (!figuresString.includes(generalBoard[wayRow][wayCol])) {
          playerWays.push([
            [checkRowIndex, checkColIndex],
            [wayRow, wayCol],
          ]);
        }
      }
    });
  }

  checkWays(
    generalBoard,
    playerBoard,
    checkRowIndex,
    checkColIndex,
    playerWays,
    figureWays,
    figuresString,
  ) {
    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way) => {
        if (isSide) {
          const wayRow = checkRowIndex + way[0];
          const wayCol = checkColIndex + way[1];

          if (wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8) {
            playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
            if (!figuresString.includes(generalBoard[wayRow][wayCol])) {
              playerWays.push([
                [checkRowIndex, checkColIndex],
                [wayRow, wayCol],
              ]);
            }

            if (generalBoard[wayRow][wayCol] !== FIGURES.EMPTY) isSide = false;
          } else isSide = false;
        }
      });
    });
  }

  checkPawnWays(
    generalBoard,
    playerBoard,
    checkRowIndex,
    checkColIndex,
    playerWays,
    figureWays,
    figuresString,
  ) {
    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way) => {
        if (isSide) {
          const wayRow = checkRowIndex + way[0];
          const wayCol = checkColIndex + way[1];

          if (wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8) {
            if (
              Math.abs(way[1]) === 1 &&
              generalBoard[wayRow][wayCol] !== FIGURES.EMPTY
            ) {
              playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
              if (!figuresString.includes(generalBoard[wayRow][wayCol])) {
                playerWays.push([
                  [checkRowIndex, checkColIndex],
                  [wayRow, wayCol],
                ]);
              }
            }

            if (Math.abs(way[1]) === 0) {
              playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
              if (!figuresString.includes(generalBoard[wayRow][wayCol])) {
                playerWays.push([
                  [checkRowIndex, checkColIndex],
                  [wayRow, wayCol],
                ]);
              }

              if (generalBoard[wayRow][wayCol] !== FIGURES.EMPTY)
                isSide = false;
            }
          } else isSide = false;
        }
      });
    });
  }

  checkKingWays(
    generalBoard,
    playerBoard,
    checkRowIndex,
    checkColIndex,
    playerWays,
    anotherPlayerWays,
    figuresString,
  ) {
    const kingInitWays = [];

    KING_WAYS.forEach((way) => {
      const wayRow = checkRowIndex + way[0];
      const wayCol = checkColIndex + way[1];

      if (wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8) {
        if (!figuresString.includes(generalBoard[wayRow][wayCol]))
          kingInitWays.push([wayRow, wayCol]);
      }
    });

    anotherPlayerWays.forEach((anotherPlayerWay) => {
      kingInitWays.forEach((kingWay, i) => {
        if (
          anotherPlayerWay[1][0] === kingWay[0] &&
          anotherPlayerWay[1][1] === kingWay[1]
        ) {
          kingInitWays.splice(i, 1);
        }
      });
    });

    this.logger.debug(kingInitWays);

    kingInitWays.forEach((way) => {
      playerBoard[way[0]][way[1]] = generalBoard[way[0]][way[1]];
      playerWays.push([
        [checkRowIndex, checkColIndex],
        [way[0], way[1]],
      ]);
    });
  }
}
