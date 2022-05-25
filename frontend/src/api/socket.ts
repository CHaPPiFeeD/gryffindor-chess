import { io, Socket } from 'socket.io-client'


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

    socket.on('/game/start', (data) => {
      res(data)
    })
  })
}



