import { Logger } from '@nestjs/common';
import { FIGURES, FOG_BOARD, KNIGHTS_WAYS } from '../../enum/constants';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createBoardsForPlayers(board: string[][]): any {
    const start = new Date();
    const whiteBoard = FOG_BOARD();
    const blackBoard = FOG_BOARD();

    board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        const cell = board[rowIndex][columnIndex];

        if ('KQBNRP'.includes(cell)) {
          whiteBoard[rowIndex][columnIndex] = cell;

          switch (true) {
            case cell.toLowerCase() === FIGURES.KING:
              return;

            case cell.toLowerCase() === FIGURES.QUEEN:
              return;

            case cell.toLowerCase() === FIGURES.BISHOP:
              return;

            case cell.toLowerCase() === FIGURES.KNIGHT:
              this.checkCellKnight(board, whiteBoard, rowIndex, columnIndex);
              return;

            case cell.toLowerCase() === FIGURES.ROOK:
              return;

            case cell.toLowerCase() === FIGURES.PAWN:
              return;

            default:
              break;
          }

          return;
        }

        if ('kqbnrp'.includes(cell)) {
          blackBoard[rowIndex][columnIndex] = cell;

          switch (true) {
            case cell.toLowerCase() === FIGURES.KING:
              return;

            case cell.toLowerCase() === FIGURES.QUEEN:
              return;

            case cell.toLowerCase() === FIGURES.BISHOP:
              return;

            case cell.toLowerCase() === FIGURES.KNIGHT:
              this.checkCellKnight(board, blackBoard, rowIndex, columnIndex);
              return;

            case cell.toLowerCase() === FIGURES.ROOK:
              return;

            case cell.toLowerCase() === FIGURES.PAWN:
              return;

            default:
              break;
          }
          return;
        }
      });
    });

    const end = new Date();
    this.logger.warn(+end - +start);
    return { whiteBoard, blackBoard };
  }

  checkCellKnight(generalBoard, playerBoard, rowIndex, columnIndex) {
    KNIGHTS_WAYS.forEach((way, i) => {
      const row = rowIndex + way[0];
      const column = columnIndex + way[1];
      if (row >= 0 && row < 8 && column >= 0 && column < 8) {
        playerBoard[row][column] = generalBoard[row][column];
      }
    });
  }
}
