import { KING_WAYS } from '../enum/figureWays';
import { API_ERROR_CODES } from '../enum/errorsCode';
import { checkCoordinates } from './validation';
import { FIGURES } from 'src/enum/constants';

export class Response {
  constructor(res: ResponseDto) {
    const result: ResponseDto = {
      status: true,
      status_code: 204,
      timestamp: new Date().toISOString(),
      errors: null,
      path: null,
      data: null,
    };
    return { ...result, ...res };
  }
}

export const N = (number: string | number | boolean): number => {
  number = +number || 0;
  return Math.round(number * 100000000) / 100000000;
};

export const randomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export class ResponseDto {
  status?: boolean;
  status_code: number;
  timestamp?: string;
  errors?: ErrorType[] | null;
  path: string;
  data?: any | null;
}

interface ErrorType {
  code: API_ERROR_CODES;
  message: string;
}

export const createWay = (checkRowIndex, checkColIndex, wayRow, wayCol) => {
  return [checkRowIndex, checkColIndex, wayRow, wayCol].join('');
};

export const createKingWays = (props): number[][] => {
  const { generalBoard, playerBoard, checkRow, checkCol, ownFigures } = props;

  const kingInitWays = [];

  KING_WAYS.forEach((way) => {
    const wayRow = checkRow + way[0];
    const wayCol = checkCol + way[1];

    const isCorrectCoordinates = checkCoordinates(wayRow, wayCol);

    if (isCorrectCoordinates) {
      playerBoard[wayRow][wayCol] = generalBoard[wayRow][wayCol];

      const isOwnFigure = ownFigures.includes(generalBoard[wayRow][wayCol]);

      if (!isOwnFigure) {
        const way = [
          [checkRow, checkCol],
          [wayRow, wayCol],
        ];

        kingInitWays.push(way);
      }
    }
  });

  return kingInitWays;
};

export const checkKingWays = (props) => {
  const {
    generalBoard,
    kingWays,
    wayRow,
    wayCol,
    checkRow,
    checkCol,
    side,
    i,
  } = props;

  kingWays.forEach((way, i) => {
    if (way[1][0] === wayRow && way[1][1] === wayCol) {
      kingWays.splice(i, 1);
    }
  });

  const isKingFigure =
    generalBoard[wayRow][wayCol].toLowerCase() === FIGURES.KING;

  if (isKingFigure) {
    const wayRow = checkRow + side[i + 1][0];
    const wayCol = checkCol + side[i + 1][1];

    kingWays.forEach((way, i) => {
      if (way[1][0] === wayRow && way[1][1] === wayCol) {
        kingWays.splice(i, 1);
      }
    });
  }
};
