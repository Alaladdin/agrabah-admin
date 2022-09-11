<template>
  <div class="min-h-screen flex bg-gray-200">
    <b-sidebar :nav-items="currentNavItems" />

    <div class="flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <t-tag
            v-if="pageTitle"
            :text="pageTitle"
            class="mb-10"
            variant="title"
            tag-name="h1"
          />

          <nuxt-child class="flex flex-col" />

          <b-app-version />
        </div>
      </div>
    </div>

    <b-context-menu />

    <b-error-modal
      v-for="error in errors"
      :key="error.id"
      :text="error.text"
      @closed="closeErrorModal(error)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filter, find, reject } from 'lodash'
import { navItems } from '@/data'
import BAppVersion from '@/components/b-app-version'
import BSidebar from '@/components/b-sidebar'
import BErrorModal from '@/components/b-error-modal'
import BContextMenu from '@/components/b-context-menu'
import SocketMixin from '@/mixins/m-socket'

export default {
  name      : 'default',
  components: {
    'b-app-version' : BAppVersion,
    'b-sidebar'     : BSidebar,
    'b-context-menu': BContextMenu,
    'b-error-modal' : BErrorModal,
  },
  mixins: [SocketMixin],
  data  : () => ({
    navItems,
  }),
  head () {
    return {
      title: this.$route.name === 'index' ? 'AGRABAH ADMIN' : this.pageTitle,
    }
  },
  computed: {
    ...mapGetters({
      user           : 'getUserData',
      updownStatus   : 'updown/getUpdownStatus',
      customPageTitle: 'getPageTitle',
      errors         : 'getErrors',
    }),

    currentNavItems () {
      const { scope: userScope } = this.user

      return filter(this.navItems, (item) => {
        return !item.hidden && (!item.scope || userScope.includes(item.scope))
      })
    },
    pageTitle () {
      if (!this.customPageTitle) {
        const navItem = find(this.navItems, { name: this.$route.name })

        return navItem.title
      }

      return this.customPageTitle
    },
  },
  watch: {
    '$route.name' () {
      this.$setPageTitle(null)
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
            this.$setSideBarNotifications('audit', changes)
          })
          .catch(this.$handleError)
      }
    },
    setHomeNavbarNotifications () {
      const offlineHosts = reject(this.updownStatus, { isOnline: true })

      this.$setSideBarNotifications('index', offlineHosts.length)
    },
    closeErrorModal (error) {
      this.$store.commit('REMOVE_ERROR', error)
    },
  },
}
</script>
