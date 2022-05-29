import { Logger } from '@nestjs/common';
import {
  addWayAndVisibility,
  createKingWays,
  createWay,
} from '../../helpers/board';
import { checkCoordinates } from '../../helpers/validation';
import {
  checkWaysPropsType,
  createBoardsForPlayersType,
} from '../../dto/board.dto';
import {
  WHITE_FIGURES,
  BLACK_FIGURES,
  FIGURES,
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
import { gameRoomType } from 'src/dto/game.dto';

export class BoardService {
  private logger = new Logger(BoardService.name);

  createBoardsForPlayers(game: gameRoomType): createBoardsForPlayersType {
    const generalBoard = game.board;
    const start = new Date();
    const whiteBoard = FOG_BOARD();
    const blackBoard = FOG_BOARD();
    const initWhiteWays = [];
    const initBlackWays = [];
    const initWhiteKingWays: number[][] = [];
    const initBlackKingWays: number[][] = [];

    generalBoard.forEach((rowValue, checkRow) => {
      rowValue.forEach((colValue, checkCol) => {
        const cell = generalBoard[checkRow][checkCol];
        let props: checkWaysPropsType = {
          game,
          generalBoard,
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
            ownKing: FIGURES.WHITE_KING,
            anotherPlayerKing: FIGURES.BLACK_KING,
            pawnWays: WHITE_PAWN_WAYS,
            kingWays: initWhiteKingWays,
          };
        }

        if (BLACK_FIGURES.includes(cell)) {
          blackBoard[checkRow][checkCol] = cell;

          props = {
            ...props,
            playerBoard: blackBoard,
            playerWays: initBlackWays,
            ownFigures: BLACK_FIGURES,
            ownKing: FIGURES.BLACK_KING,
            anotherPlayerKing: FIGURES.WHITE_KING,
            pawnWays: BLACK_PAWN_WAYS,
            kingWays: initBlackKingWays,
          };
        }

        switch (true) {
          case cell.toLowerCase() === FIGURES.BLACK_KING:
            createKingWays(props);
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
        addWayAndVisibility({ ...props, wayRow, wayCol });
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
            addWayAndVisibility({ ...props, side, wayRow, wayCol, i });

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
    const initPosPawn = pawnWays === WHITE_PAWN_WAYS ? 6 : 1;

    pawnWays.forEach((way) => {
      const wayRow = checkRow + way[0];
      const wayCol = checkCol + way[1];

      const step = pawnWays === WHITE_PAWN_WAYS ? wayRow + 1 : wayRow - 1;

      const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

      if (isCorrectCoordinates) {
        const isStep =
          Math.abs(way[0]) === 1 &&
          Math.abs(way[1]) === 0 &&
          generalBoard[wayRow][wayCol] === FIGURES.EMPTY;

        const isDiagonal =
          Math.abs(way[1]) === 1 &&
          generalBoard[wayRow][wayCol] !== FIGURES.EMPTY;

        const isTwoSteps =
          checkRow === initPosPawn &&
          Math.abs(way[0]) === 2 &&
          Math.abs(way[1]) === 0 &&
          generalBoard[wayRow][wayCol] === FIGURES.EMPTY &&
          generalBoard[step][wayCol] === FIGURES.EMPTY;

        if (isDiagonal || isStep || isTwoSteps)
          addWayAndVisibility({ ...props, wayRow, wayCol });
      }
    });
  }
}
