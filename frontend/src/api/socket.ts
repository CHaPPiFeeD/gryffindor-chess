import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { showNotification } from '../store/notification/notificationSlise';
import {
  gameDataType,
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
    console.log('connect:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('disconnect:', socket.id);
  });

  socket.on('error', (data) => {
    console.log('error:', data);
    if (data === 'Unauthorized') {
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
  socket.emit('/queue/search', data);
  cb();
};

export const getGame = (cb: Function) => {
  socket.on('/game:get', (payload: gameDataType) => {
    cb(payload);
  });
};

export const getUsers = (cb: Function) => {
  socket.on('/queue:get', (payload: usersQueueType[]) => {
    cb(payload);
  });
};

export const leaveQueue = () => {
  socket.emit('/queue/leave');
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
    console.log(payload);
    
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

