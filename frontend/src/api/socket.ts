import { io, Socket } from 'socket.io-client'
import { setBoard } from '../store/game/gameSlise';
import { gameDataType } from './types';


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

export const regInQueue = (data: any) => {
  return new Promise((res, rej) => {
    socket.emit('/queue/search', data)

    socket.on('/game/start', (data: gameDataType) => {
      res(data)
    })
  })
}

export const move = (data: any) => {
  socket.emit('/game/move:post', data)
}

export const getBoard = (cb: any) => {
  socket.on('/game/move:get', (payload: gameDataType) => {
    cb(payload)
  })
}

export const checkEndGame = (cb: any) => {
  socket.on('/game/end', (payload) => {
    cb(payload)
  })
}

export const socketConnection = () => {
  if (!socket) window.location.href = '/'
}

export const surrender = () => {
  socket.emit('/game/surrender')
}



