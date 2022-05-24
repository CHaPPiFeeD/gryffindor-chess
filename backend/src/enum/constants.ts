export const CHESS_COLORS = {
  WHITE: 'white',
  BLACK: 'black',
};

export const FIGURES = {
  KING: 'k',
  QUEEN: 'q',
  BISHOP: 'b',
  KNIGHT: 'n',
  ROOK: 'r',
  PAWN: 'p',
  EMPTY: '.',
};

export const FIGURES_COLORS = {
  WHITE: {
    KING: 'K',
    QUEEN: 'Q',
    BISHOP: 'B',
    KNIGHT: 'N',
    ROOK: 'R',
    PAWN: 'P',
  },
  BLACK: {
    KING: 'k',
    QUEEN: 'q',
    BISHOP: 'b',
    KNIGHT: 'n',
    ROOK: 'r',
    PAWN: 'p',
  },
};

export const BOARD: string[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', '.'], // lover case - black
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // upper case - white
  ['.', '.', '.', '.', '.', '.', '.', '.'], // TODO Take it all back
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', 'q', '.', '.', 'r'],
  ['P', 'P', 'P', 'P', 'K', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', '.', 'B', 'N', 'R'],
];

// export const BOARD = [
//   ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // lover case - black
//   ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // upper case - white
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
//   ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
// ];

// prettier-ignore
export const ATTACKS: string[][] = [
  ['bq',  '',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '',  '','bq'],
  [  '','bq',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '','bq',  ''],
  [  '',  '','bq',  '',  '',  '',   '', 'rq',   '',  '',  '',  '','bq',  '',  ''],
  [  '',  '',  '','bq',  '',  '',   '', 'rq',   '',  '',  '','bq',  '',  '',  ''],
  [  '',  '',  '',  '','bq',  '',   '', 'rq',   '',  '','bq',  '',  '',  '',  ''],
  [  '',  '',  '',  '',  '','bq',  'n', 'rq',  'n','bq',  '',  '',  '',  '',  ''],
  [  '',  '',  '',  '',  '', 'n','bkq','rkq','bkq', 'n',  '',  '',  '',  '',  ''],
  ['rq','rq','rq','rq','rq','rq','rkq',  '0','rkq','rq','rq','rq','rq','rq','rq'],
  [  '',  '',  '',  '',  '', 'n','bkq','rkq','bkq', 'n',  '',  '',  '',  '',  ''],
  [  '',  '',  '',  '',  '','bq',  'n', 'rq',  'n','bq',  '',  '',  '',  '',  ''],
  [  '',  '',  '',  '','bq',  '',   '', 'rq',   '',  '','bq',  '',  '',  '',  ''],
  [  '',  '',  '','bq',  '',  '',   '', 'rq',   '',  '',  '','bq',  '',  '',  ''],
  [  '',  '','bq',  '',  '',  '',   '', 'rq',   '',  '',  '',  '','bq',  '',  ''],
  [  '','bq',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '','bq',  ''],
  ['bq',  '',  '',  '',  '',  '',   '', 'rq',   '',  '',  '',  '',  '',  '','bq'],
];

// prettier-ignore
export const PAWN_ATTACKS: string[][] = [
  [ '', 'P',  ''],
  ['P', 'P', 'P'],
  [ '',  '',  ''],
  ['p', 'p', 'p'],
  [ '', 'p',  ''],
];

export const FOG_BOARD = (): string[][] => [
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
  ['~', '~', '~', '~', '~', '~', '~', '~'],
];

export const WHITE_FIGURES = 'KQBNRP';

export const BLACK_FIGURES = 'kqbnrp';
