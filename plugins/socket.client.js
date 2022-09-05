import { io } from 'socket.io-client'
import { getFromLocalStorage } from '@/helpers'

const socketClient = io({
  path           : '/ws',
  rememberUpgrade: true,
  extraHeaders   : {
    AuthToken    : process.env.AUTH_TOKEN,
    Authorization: getFromLocalStorage('auth._token.local', null),
  },
  reconnectionDelay: 3000,
})

export default (options, inject) => {
  inject('socket', socketClient)
}
