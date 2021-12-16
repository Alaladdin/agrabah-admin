<template>
  <div class="min-h-screen flex bg-gray-200">
    <SideBar />

    <div class="pl-64 flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <t-tag v-if="pageTitle" class="mb-10" variant="title" tag-name="h1">{{ pageTitle }}</t-tag>

          <Nuxt class="flex flex-col" />

          <AppVersion />
        </div>
      </div>
    </div>

    <t-modal
      v-for="(error, index) in errors"
      :key="index"
      :value="!!error"
      header="Error"
      variant="danger"
      @closed="closeErrorModal(error)"
    >
      <div class="flex items-center">
        <div class="flex items-center justify-center rounded-full h-10 w-10 bg-red-200 text-lg">
          <fa icon="exclamation-triangle" />
        </div>

        <p class="ml-4 whitespace-pre-line">{{ error }}</p>
      </div>
    </t-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { find, reject } from 'lodash'
import { navItems } from '@/data'

export default {
  name: 'Default',
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

      this.$setSideBarNotifications('home', notOnlineHosts.length)
    },
    closeErrorModal (error) {
      this.$store.commit('REMOVE_ERROR', error)
    },
  },
}
</script>
