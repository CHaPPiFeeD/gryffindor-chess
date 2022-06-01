import { io, Socket } from 'socket.io-client'
import { gameDataType, moveDataType, usersQueueType } from './types';


let socket: Socket;

export const joinSocket = () => {
  socket = io(`${process.env.REACT_APP_API_KEY}`)

  socket.on('connect', () => {
    console.log('socket:', socket.id)
    localStorage.setItem('socket', socket.id)
  })

  socket.on('error', (data) => {
    console.log('error:', data)
    socket.disconnect()
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
  socket.on('/game/start', (data: gameDataType) => {
    cb(data)
  })
}

export const move = (data: moveDataType) => {
  socket.emit('/game/move:post', data)
}

export const getBoard = (cb: Function) => {
  socket.on('/game/move:get', (payload: gameDataType) => {
    console.log(payload.log)
    cb(payload)
  })
}

export const checkEndGame = (cb: Function) => {
  socket.on('/game/end', (payload) => {
    cb(payload)
  })
}

export const checkSocketConnection = () => {
  if (!socket) window.location.href = '/'
}

export const surrender = () => {
  socket.emit('/game/surrender')
}

