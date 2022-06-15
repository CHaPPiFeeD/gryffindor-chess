import { io, Socket } from 'socket.io-client';
import { showNotification } from '../store/notification/notificationSlise';
import { WS_EVENTS } from './constants';
import { GameDataType, MoveDatatype, UsersQueueType } from './types';

let socket: Socket;

export const joinSocket = () => {
  if (socket?.connected) return;

  socket = io(
    `${process.env.REACT_APP_API_KEY}`,
    {
      closeOnBeforeunload: false,
      auth: {
        token: localStorage.getItem('access_token'),
      },
    },
  );

  socket.on('connect', () => {
    console.log('connect:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
    window.location.href = '/';
  });

  socket.on('error', (data) => {
    console.log('error:', data);

    if (data === 'Unauthorized') {
      localStorage.clear();
      window.location.href = '/';
    }

    socket.disconnect();
  });
};

export const exceptionHandler = (dispatch: any) => {
  socket.on('exception', (exception) => {
    console.log(exception);
    dispatch(showNotification(exception?.message, exception?.status));
  });
};

export const regInQueue = (data: any, cb: Function) => {
  socket.emit(WS_EVENTS.QUEUE.SEARCH, data, (isFind: boolean) => {
    cb(isFind);
  });
};

export const getGame = (cb: Function) => {
  socket.emit(WS_EVENTS.GAME.GET_GAME);

  socket.on(WS_EVENTS.GAME.GET_GAME, (payload: GameDataType) => {
    cb(payload);
  });
};

export const getUsers = (cb: Function) => {
  socket.emit(WS_EVENTS.QUEUE.GET_QUEUE);

  socket.on(WS_EVENTS.QUEUE.GET_QUEUE, (payload: UsersQueueType[]) => {
    cb(payload);
  });
};

export const removeEventListener = (listener: any) => {
  socket.removeListener(listener);
};

export const leaveQueue = () => {
  socket.emit(WS_EVENTS.QUEUE.LEAVE);
};

export const move = (data: MoveDatatype) => {
  socket.emit(WS_EVENTS.GAME.MOVE, data);
};

export const checkEndGame = (cb: Function) => {
  socket.on(WS_EVENTS.GAME.END, (payload) => {
    cb(payload);
  });
};

export const checkSocketConnection = () => {
  if (!socket) window.location.href = '/game/search';
};

export const leaveGame = () => {
  socket.emit(WS_EVENTS.GAME.LEAVE);
};

export const offerDraw = (isDrawing: boolean) => {
  socket.emit(WS_EVENTS.GAME.DRAW, isDrawing);
};

export const getOfferDraw = (cb: Function) => {
  socket.on(WS_EVENTS.GAME.DRAW, () => {
    cb();
  });
};

export const checkOpponentDisconnect = (cb: Function) => {
  socket.on(WS_EVENTS.GAME.DISCONNECT_OPPONENT, (isDisconnect) => {
    cb(isDisconnect);
  });
};
