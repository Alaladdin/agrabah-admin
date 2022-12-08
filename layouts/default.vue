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

          <client-only>
            <b-socket-indicator v-if="currentUser.loggedIn" />
          </client-only>

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
import { filter, find } from 'lodash'
import { navItems } from '@/data'
import BAppVersion from '@/components/b-app-version'
import BSocketIndicator from '@/components/b-socket-indicator'
import BSidebar from '@/components/b-sidebar'
import BErrorModal from '@/components/b-error-modal'
import BContextMenu from '@/components/b-context-menu'
import SocketMixin from '@/mixins/m-socket'

export default {
  name      : 'default',
  components: {
    'b-socket-indicator': BSocketIndicator,
    'b-app-version'     : BAppVersion,
    'b-sidebar'         : BSidebar,
    'b-context-menu'    : BContextMenu,
    'b-error-modal'     : BErrorModal,
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
      currentUser    : 'getUserData',
      customPageTitle: 'getPageTitle',
      errors         : 'getErrors',
    }),

    currentNavItems () {
      const { scope: userScope } = this.currentUser

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
      loadChanges: 'changes/init',
    }),

    init () {
      const { isAdmin } = this.currentUser

      if (isAdmin && this.$route.name !== 'index') {
        this.loadChanges()
          .then((changes) => {
            this.$setSideBarNotifications('index', changes)
          })
          .catch(this.$handleError)
      }
    },
    closeErrorModal (error) {
      this.$store.commit('REMOVE_ERROR', error)
    },
  },
}
</script>
