import { io } from 'socket.io-client'

export default ({ app }, inject) => {
  const socketClient = io({
    path             : '/ws',
    reconnectionDelay: 5000,
    secure           : false,
    autoConnect      : false,
  })

  inject('socket', socketClient)
}
