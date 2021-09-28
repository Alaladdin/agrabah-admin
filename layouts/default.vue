<template>
  <div class="flex bg-gray-200">
    <SideBar />

    <div class="flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <h1 v-if="pageTitle" class="mb-10 font-bold text-3xl text-gray-800 text-center">
            {{ pageTitle }}
          </h1>

          <Nuxt class="flex flex-col" />

          <a v-if="appVersion" class="badge fixed bottom-3 right-3" href="https://github.com/Alaladdin/mpei-admin-nuxt" target="_blank">
            v {{ appVersion }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { find, filter } from 'lodash'
import navItems from '@/data/nav'
import updownServices from '@/data/updownServices'

export default {
  name: 'Default',
  data () {
    return {
      navItems,
    }
  },
  computed: {
    ...mapGetters({ appVersion: 'getAppVersion' }),

    pageTitle () {
      const { path } = this.$route
      const { user } = this.$auth.$state

      if (path !== '/' || !user) {
        const currentRouteData = find(navItems, navItem => navItem.path === path)

        return currentRouteData ? currentRouteData.title : ''
      }

      return `Hi, ${user.username}`
    },
  },
  mounted () {
    this.loadAppVersion()
    this.getUpdownStatus()
      .then((allHosts) => {
        const hosts = filter(allHosts, (host) => {
          return find(updownServices, service => service.url && host.url.includes(service.url))
        })

        const onlineHosts = filter(hosts, host => !host.down)

        this.$store.commit('patchNavbarNotifications', {
          key  : 'home',
          value: updownServices.length - onlineHosts.length,
        })
      })
      .catch(() => {})
  },
  methods: {
    ...mapActions(['loadAppVersion']),
    ...mapActions('updown', ['getUpdownStatus']),
  },
}
</script>
