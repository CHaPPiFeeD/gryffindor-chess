import { Logger } from '@nestjs/common';
import { createWay } from 'src/helpers';
import { FIGURES, FOG_BOARD } from '../../enum/constants';
import {
  BISHOP_WAYS,
  KNIGHTS_WAYS,
  QUEEN_WAYS,
  ROOK_WAYS,
} from '../../enum/figureWays';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createBoardsForPlayers(board: string[][]): any {
    const start = new Date();
    const whiteBoard = FOG_BOARD();
    const blackBoard = FOG_BOARD();
    const whiteWays = [];
    const blackWays = [];

    board.forEach((row, checkRowIndex) => {
      row.forEach((column, checkColIndex) => {
        const cell = board[checkRowIndex][checkColIndex];
        let selectBoard;
        let selectWays;

        if ('KQBNRP'.includes(cell)) {
          whiteBoard[checkRowIndex][checkColIndex] = cell;
          selectBoard = whiteBoard;
          selectWays = whiteWays;
        }

        if ('kqbnrp'.includes(cell)) {
          blackBoard[checkRowIndex][checkColIndex] = cell;
          selectBoard = blackBoard;
          selectWays = blackWays;
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.KING:
            break;

          case cell.toLowerCase() === FIGURES.QUEEN:
            this.checkWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
              QUEEN_WAYS,
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
            );
            break;

          case cell.toLowerCase() === FIGURES.KNIGHT:
            this.checkKnightWays(
              board,
              selectBoard,
              checkRowIndex,
              checkColIndex,
              selectWays,
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
            );
            break;

          case cell.toLowerCase() === FIGURES.PAWN:
            break;

          default:
            break;
        }
      });
    });

    const end = new Date();
    this.logger.warn(+end - +start);

    return { whiteBoard, blackBoard, whiteWays, blackWays };
  }

  checkKnightWays(
    generalBoard,
    playerBoard,
    checkRowIndex,
    checkColIndex,
    ways,
  ) {
    KNIGHTS_WAYS.forEach((way) => {
      const wayRow = checkRowIndex + way[0];
      const wayCol = checkColIndex + way[1];
      if (wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8) {
        playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
        ways.push(createWay(checkRowIndex, checkColIndex, wayRow, wayCol));
      }
    });
  }

  checkWays(
    generalBoard,
    playerBoard,
    checkRowIndex,
    checkColIndex,
    playersWays,
    figureWays,
  ) {
    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way) => {
        if (isSide) {
          const wayRow = checkRowIndex + way[0];
          const wayCol = checkColIndex + way[1];

          if (wayRow >= 0 && wayRow < 8 && wayCol >= 0 && wayCol < 8) {
            playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];
            playersWays.push(
              createWay(checkRowIndex, checkColIndex, wayRow, wayCol),
            );
            if (generalBoard[wayRow][wayCol] !== FIGURES.EMPTY) isSide = false;
          } else isSide = false;
        }
      });
    });
  }
}
