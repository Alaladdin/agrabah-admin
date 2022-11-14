import { mapGetters } from 'vuex'
import { keys } from 'lodash'

export default {
  mounted () {
    if (this.currentUser.loggedIn)
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
      currentUser: 'getUserData',
      pageTitle  : 'getPageTitle',
    }),
  },
  methods: {
    initSocket () {
      this.connectSocket()
      this.sendUserActivity()
      this.$socket.on('users-online', this.onUsersOnline)
    },
    connectSocket () {
      this.$socket.io.opts.extraHeaders = {
        AuthToken    : process.env.authToken,
        Authorization: this.$auth.strategy.token.get(),
      }
      this.$socket.connect()
    },
    onUsersOnline (onlineUsers) {
      this.$store.commit('SET_ONLINE_USERS', onlineUsers)
      this.$setSideBarNotifications('team', keys(onlineUsers).length)
    },
    sendUserActivity () {
      this.$socket?.emit('user-activity', {
        pageTitle: this.pageTitle?.toLowerCase(),
        action   : 'chilling',
      })
    },
  },
}
