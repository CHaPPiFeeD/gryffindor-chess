export const endpoints = {
  login: () => `${process.env.REACT_APP_API_HOST}/api/auth/login`,
  createUser: () => `${process.env.REACT_APP_API_HOST}/api/auth/create`,
  registration: () => `${process.env.REACT_APP_API_HOST}/api/auth/registration`,
  rate: () => `${process.env.REACT_APP_API_HOST}/api/rate/top`,
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
