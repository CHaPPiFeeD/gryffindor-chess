import { Logger } from '@nestjs/common';
import { checkBoardPos, createKingWays, createWay } from '../../helpers/board';
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
import { gameType } from 'src/dto/game.dto';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createBoardsForPlayers(game: gameType): createBoardsForPlayersType {
    const board = game.board;
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
          whiteBoard[checkRow][checkCol] = cell;
          initWhiteKingWays = createKingWays({
            generalBoard: board,
            playerBoard: whiteBoard,
            checkRow,
            checkCol,
            ownFigures: WHITE_FIGURES,
          });
        }

        if (cell === FIGURES_COLORS.BLACK.KING) {
          blackBoard[checkRow][checkCol] = cell;
          initBlackKingWays = createKingWays({
            generalBoard: board,
            playerBoard: blackBoard,
            checkRow,
            checkCol,
            ownFigures: BLACK_FIGURES,
          });
        }
      });
    });

    board.forEach((rowValue, checkRow) => {
      rowValue.forEach((colValue, checkCol) => {
        const cell = board[checkRow][checkCol];
        let props: checkWaysPropsType = {
          game,
          generalBoard: board,
          checkRow,
          checkCol,
        };

        if (WHITE_FIGURES.includes(cell)) {
          whiteBoard[checkRow][checkCol] = cell;

          props = {
            ...props,
            playerBoard: whiteBoard,
            playerWays: initWhiteWays,
            ownFigures: WHITE_FIGURES,
            ownKing: FIGURES_COLORS.WHITE.KING,
            anotherPlayerKing: FIGURES_COLORS.BLACK.KING,
            kingWays: initBlackKingWays,
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
            ownKing: FIGURES_COLORS.BLACK.KING,
            anotherPlayerKing: FIGURES_COLORS.WHITE.KING,
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

    [...initWhiteKingWays, ...initWhiteWays].forEach((way) => {
      whiteWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    [...initBlackKingWays, ...initBlackWays].forEach((way) => {
      blackWays.push(createWay(way[0][0], way[0][1], way[1][0], way[1][1]));
    });

    return { whiteBoard, blackBoard, whiteWays, blackWays };
  }

  checkKnightWays(props: checkWaysPropsType, figureWays: number[][]) {
    const { checkRow, checkCol } = props;

    figureWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates) {
        checkBoardPos({ ...props, wayRow, wayCol }, false);
      }
    });
  }

  checkWays(props: checkWaysPropsType, figureWays: number[][][]) {
    const { generalBoard, checkRow, checkCol } = props;

    figureWays.forEach((side) => {
      let isSide = true;

      side.forEach((way, i) => {
        if (isSide) {
          const wayRow = checkRow + way[0];
          const wayCol = checkCol + way[1];

          const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

          if (isCorrectCoordinates) {
            checkBoardPos({ ...props, side, wayRow, wayCol, i }, true);

            const isCellNotEmpty =
              generalBoard[wayRow][wayCol] !== FIGURES.EMPTY;

            if (isCellNotEmpty) isSide = false;
          } else isSide = false;
        }
      });
    });
  }

  checkPawnWays(props: checkWaysPropsType) {
    const { generalBoard, checkRow, checkCol, pawnWays } = props;

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
              checkBoardPos({ ...props, side, wayRow, wayCol, i }, true);
            }

            if (isCellNotEmpty) isSide = false;
          } else isSide = false;
        }
      });
    });
  }
}
