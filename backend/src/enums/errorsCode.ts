export enum API_ERROR_CODES {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_WRONG_PASSWORD = 'USER_WRONG_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export const API_ERROR_CODES_MESSAGES = {
  INTERNAL_ERROR: 'Internal error exception.',
  UNEXPECTED_ERROR: 'Unexpected error. Please, try again.',
  UNAUTHORIZED: 'User UNAUTHORIZED.',
  USER_WRONG_PASSWORD: 'User wrong password.',
  USER_NOT_FOUND: 'User not found.',
};

export const API_STATUS_CODES = {
  400: [
    API_ERROR_CODES.INTERNAL_ERROR,
    API_ERROR_CODES.USER_NOT_FOUND,
    API_ERROR_CODES.USER_WRONG_PASSWORD,
  ],
  401: [],
  403: [],
};

export const API_STATUS_MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};

export type APPLICATION_ERROR_CODES = API_ERROR_CODES | API_ERROR_CODES[];
