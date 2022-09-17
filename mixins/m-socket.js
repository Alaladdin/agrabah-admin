import { mapGetters } from 'vuex'
import { keys } from 'lodash'

export default {
  mounted () {
    if (this.user.loggedIn)
      this.initSocket()
  },
  beforeDestroy () {
    this.$socket.off()
    this.$socket.disconnect()

    this.$store.commit('CLEAR_ONLINE_USERS')
    this.$setSideBarNotifications('team', 0)
  },
  watch: {
    pageTitle () {
      this.sendUserActivity()
    },
  },
  computed: {
    ...mapGetters({
      pageTitle: 'getPageTitle',
    }),
  },
  methods: {
    initSocket () {
      this.connectSocket()
      this.sendUserActivity()
      this.$socket.on('connect', this.onConnect)
      this.$socket.on('disconnect', this.onDisconnect)
      this.$socket.on('users-online', this.onUsersOnline)
    },
    connectSocket () {
      this.$socket.io.opts.extraHeaders = {
        AuthToken    : process.env.AUTH_TOKEN,
        Authorization: this.$auth.strategy.token.get(),
      }
      this.$socket.connect()
    },
    onConnect () {
      this.$toast.success('Connected to socket', { duration: 2000 })
    },
    onDisconnect () {
      this.$toast.error('Disconnected from socket', { duration: 2000 })
    },
    onUsersOnline (onlineUsers) {
      this.$store.commit('SET_ONLINE_USERS', onlineUsers)
      this.$setSideBarNotifications('team', keys(onlineUsers).length)
    },
    sendUserActivity () {
      this.$socket?.emit('user-activity', {
        page  : this.pageTitle?.toLowerCase(),
        action: 'chilling',
      })
    },
  },
}
