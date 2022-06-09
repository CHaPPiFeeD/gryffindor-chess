import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { showNotification } from '../store/notification/notificationSlise';
import {
  gameDataType,
  gameStartDataType,
  moveDataType,
  usersQueueType,
} from './types';

let socket: Socket;

export const joinSocket = () => {
  if (socket?.connected) return;

  const params: Partial<ManagerOptions & SocketOptions> = {
    extraHeaders: {
      closeOnBeforeunload: 'false',
    },
    auth: {
      token: localStorage.getItem('access_token'),
    },
  };

  socket = io(
    `${process.env.REACT_APP_API_KEY}`,
    { ...params },
  );

  socket.on('connect', () => {
    console.log('socket:', socket.id);
    localStorage.setItem('socket', socket.id);
  });

  socket.on('disconnect', () => {
    console.log(socket);
  });

  socket.on('error', (data) => {
    console.log('error:', data);
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
  socket.emit('/queue/search', data);

  socket.on('/queue:get', (data: usersQueueType[]) => {
    cb(data);
  });
};

export const leaveQueue = () => {
  socket.emit('/queue/leave');
};

export const getUsers = (cb: Function) => {
  socket.emit('/queue:post');

  socket.on('/queue:get', (data: usersQueueType[]) => {
    cb(data);
  });
};

export const startGame = (cb: Function) => {
  socket.on('/game/start', (payload: gameStartDataType) => {
    cb(payload);
  });
};

export const move = (data: moveDataType) => {
  socket.emit('/game/move:post', data);
};

export const getBoard = (cb: Function) => {
  socket.on('/game/move:get', (payload: gameDataType) => {
    cb(payload);
  });
};

export const checkEndGame = (cb: Function) => {
  socket.on('/game/end', (payload) => {
    cb(payload);
  });
};

export const checkSocketConnection = () => {
  if (!socket) window.location.href = '/game/search';
};

export const leaveGame = () => {
  socket.emit('/game/leave');
};

export const offerDraw = (isDrawing: boolean) => {
  socket.emit('/game/draw', isDrawing);
};

export const getOfferDraw = (cb: Function) => {
  socket.on('/game/draw', () => {
    cb();
  });
};

