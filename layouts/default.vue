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
import { find, filter } from 'lodash'
import { navItems, updownServices } from '@/data'

export default {
  name: 'Default',
  data () {
    return {
      navItems,
    }
  },
  computed: {
    ...mapGetters({ errors: 'getErrors' }),

    pageTitle () {
      const { path } = this.$route
      const { user } = this.$auth.$state

      if (!user || path !== '/') {
        const currentRouteData = find(navItems, navItem => navItem.path === path)

        return currentRouteData ? currentRouteData.title : ''
      }

      return `Hi, ${user.username}`
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({ loadUpdownStatus: 'updown/loadUpdownStatus' }),

    init () {
      this.loadUpdownStatus()
        .then(this.setHomeNavbarNotifications)
        .catch(this.$handleError)
    },
    setHomeNavbarNotifications (allHosts) {
      const hosts = filter(allHosts, (host) => {
        return find(updownServices, service => service.url && host.url.includes(service.url))
      })

      const onlineHosts = filter(hosts, host => !host.error)

      this.$setSideBarNotifications('home', updownServices.length - onlineHosts.length)
    },
    closeErrorModal (error) {
      this.$store.commit('REMOVE_ERROR', error)
    },
  },
}
</script>
