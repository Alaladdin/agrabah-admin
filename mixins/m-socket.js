
export default {
  mounted () {
    if (this.user.loggedIn)
      this.initSocket()
  },
  beforeDestroy () {
    this.$socket.off()
    this.$socket.disconnect()

    this.$store.commit('SET_ONLINE_USERS', [])
    this.$setSideBarNotifications('team', 0)
  },
  methods: {
    initSocket () {
      this.connectSocket()
      this.$socket.on('users-online', this.usersOnline)
    },
    connectSocket () {
      this.$socket.io.opts.extraHeaders = {
        AuthToken    : process.env.AUTH_TOKEN,
        Authorization: this.$auth.strategy.token.get(),
      }
      this.$socket.connect()
    },
    usersOnline (sock) {
      this.$store.commit('SET_ONLINE_USERS', sock.onlineUsers)
      this.$setSideBarNotifications('team', sock.onlineUsers.length)
    },
  },
}
