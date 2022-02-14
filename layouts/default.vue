<template>
  <div class="min-h-screen flex bg-gray-200">
    <b-sidebar :nav-items="navItems" />

    <div class="pl-64 flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <t-tag v-if="pageTitle" class="mb-10" variant="title" tag-name="h1">{{ pageTitle }}</t-tag>

          <nuxt class="flex flex-col" />

          <b-app-version />
        </div>
      </div>
    </div>

    <b-error-modal
      v-for="(error, index) in errors"
      :key="index"
      :error="error"
      @closed="closeErrorModal(error)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { find, reject } from 'lodash'
import { navItems } from '@/data'
import BAppVersion from '@/components/b-app-version'
import BSidebar from '@/components/b-sidebar'
import BErrorModal from '@/components/b-error-modal'

export default {
  name      : 'default',
  components: {
    'b-app-version': BAppVersion,
    'b-sidebar'    : BSidebar,
    'b-error-modal': BErrorModal,
  },
  data () {
    return {
      navItems,
    }
  },
  computed: {
    ...mapGetters({
      errors        : 'getErrors',
      user          : 'getUserData',
      updownServices: 'updown/getUpdownServices',
    }),

    pageTitle () {
      const { path } = this.$route
      const { username, loggedIn } = this.user

      if (!loggedIn || path !== '/') {
        const currentRouteData = find(navItems, { path })

        return currentRouteData?.title || ''
      }

      return `Hi, ${username}`
    },
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions({
      loadUpdownStatus: 'updown/loadUpdownStatus',
      loadChanges     : 'audit/init',
    }),

    init () {
      this.loadUpdownStatus()
        .then(this.setHomeNavbarNotifications)
        .catch(this.$handleError)

      if (this.user.isAdmin && this.$route.name !== 'audit') {
        this.loadChanges()
          .then((changes) => {
            this.$setSideBarNotifications('audit', changes.length)
          })
          .catch(this.$handleError)
      }
    },
    setHomeNavbarNotifications () {
      const notOnlineHosts = reject(this.updownServices, { isOnline: true })

      this.$setSideBarNotifications('index', notOnlineHosts.length)
    },
    closeErrorModal (error) {
      this.$store.commit('REMOVE_ERROR', error)
    },
  },
}
</script>
