export const COLORS = {
  WHITE: 'white',
  BLACK: 'black',
};

export const FIGURES = {
  BLACK_KING: 'k',
  BLACK_QUEEN: 'q',
  BLACK_BISHOP: 'b',
  BLACK_KNIGHT: 'n',
  BLACK_ROOK: 'r',
  BLACK_PAWN: 'p',
  WHITE_KING: 'K',
  WHITE_QUEEN: 'Q',
  WHITE_BISHOP: 'B',
  WHITE_KNIGHT: 'N',
  WHITE_ROOK: 'R',
  WHITE_PAWN: 'P',
  EMPTY: '.',
  FOG: '~',
};

export const INIT_BOARD = (): string[][] => [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

// export const INIT_BOARD = (): string[][] => [
//   ['.', '.', '.', '.', 'k', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.'],
//   ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
//   ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
// ];

// prettier-ignore
export const ATTACKS_SCHEME: string[][] = [
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
export const PAWN_ATTACKS_SCHEME: string[][] = [
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

export const FIRST_LETTER = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h',
};

export const SECOND_LETTER = {
  0: '8',
  1: '7',
  2: '6',
  3: '5',
  4: '4',
  5: '3',
  6: '2',
  7: '1',
};

export const WS_EVENTS = {
  QUEUE: {
    SEARCH: '/queue/search',
    LEAVE: '/queue/leave',
    GET_QUEUE: '/queue:get',
  },
  GAME: {
    MOVE: '/game/move',
    LEAVE: '/game/leave',
    GET_GAME: '/game:get',
    DRAW: '/game/draw',
    RECONNECT: '/game/reconnect',
    END: '/game/end',
    DISCONNECT_OPPONENT: '/game/opponent/disconnect',
  },
};

export const GAME_MODES = {
  STANDART: 'STANDART',
  FOG: 'FOG',
};
