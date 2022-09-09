
export default {
  mounted () {
    if (this.user.loggedIn)
      this.initSocket(this.user.token)
  },
  beforeDestroy () {
    this.$socket.off()
    this.$socket.disconnect()

    this.$store.commit('SET_ONLINE_USERS', [])
    this.$setSideBarNotifications('team', 0)
  },
  methods: {
    initSocket (userToken) {
      this.$socket.io.opts.extraHeaders = {
        AuthToken    : process.env.AUTH_TOKEN,
        Authorization: 'Bearer ' + userToken,
      }
      this.$socket.connect()
      this.$socket.on('users-online', this.usersOnline)
    },
    usersOnline (sock) {
      this.$store.commit('SET_ONLINE_USERS', sock.onlineUsers)
      this.$setSideBarNotifications('team', sock.onlineUsers.length)
    },
  },
}
