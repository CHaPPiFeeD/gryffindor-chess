import { io, Socket } from 'socket.io-client'
import { handleError, showNotification } from '../store/notification/notificationSlise';
import { gameDataType, gameStartDataType, moveDataType, usersQueueType } from './types';
import { AppDispatch } from '../store'


let socket: Socket;

export const joinSocket = (dispatch: AppDispatch) => {
  socket = io(`${process.env.REACT_APP_API_KEY}`)

  socket.on('connect', () => {
    console.log('socket:', socket.id)
    localStorage.setItem('socket', socket.id)
  })

  socket.on('error', (data) => {
    console.log('error:', data)
    socket.disconnect()
  })

  socket.on('exception', (data) => {
    console.log(data);
    dispatch(showNotification(data?.message, data?.status))
  })
}

export const exceptionHandler = (cb: Function) => {
  if (!socket?.connected) return
  socket.on('exception', (data) => {
    console.log(data);
    cb(data)
  })
}

export const regInQueue = (data: any, cb: Function) => {
  socket.emit('/queue/search', data)

  socket.on('/queue:get', (data: usersQueueType[]) => {
    cb(data);
  })
}

export const leaveQueue = () => {
  socket.emit('/queue/leave')
}

export const getUsers = (cb: Function) => {
  socket.emit('/queue:post')

  socket.on('/queue:get', (data: usersQueueType[]) => {
    cb(data);
  })
}

export const startGame = (cb: Function) => {
  socket.on('/game/start', (payload: gameStartDataType) => {
    cb(payload)
  })
}

export const move = (data: moveDataType) => {
  socket.emit('/game/move:post', data)
}

export const getBoard = (cb: Function) => {
  socket.on('/game/move:get', (payload: gameDataType) => {
    cb(payload)
  })
}

export const checkEndGame = (cb: Function) => {
  socket.on('/game/end', (payload) => {
    cb(payload)
  })
}

export const checkSocketConnection = () => {
  console.log(socket);
  
  if (!socket) window.location.href = '/'
}

export const leaveGame = () => {
  socket.emit('/game/leave')
}

export const offerDraw = (isDrawing: boolean) => {
  socket.emit('/game/draw', isDrawing);
}

export const getOfferDraw = (cb: Function) => {
  socket.on('/game/draw', () => {
    cb()
  })
}

