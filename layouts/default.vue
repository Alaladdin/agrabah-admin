<template>
  <div class="min-h-screen flex bg-gray-200">
    <b-sidebar :nav-items="currentNavItems" @folder-toggled="onFolderToggle" />

    <div class="pl-64 flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <t-tag
            v-if="pageTitle"
            :text="pageTitle"
            class="mb-10"
            :class="{ 'text-2xl': user.loggedIn && $route.name === 'index' }"
            variant="title"
            tag-name="h1"
          />

          <nuxt-child class="flex flex-col" />

          <b-app-version />
        </div>
      </div>
    </div>

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
import { assign, each, filter, map, reject } from 'lodash'
import { navItems } from '@/data'
import BAppVersion from '@/components/b-app-version'
import BSidebar from '@/components/b-sidebar'
import BErrorModal from '@/components/b-error-modal'
import { getFromLocalStorage, setToLocalStorage } from '@/helpers'

const SIDEBAR_STORE_KEY = 'sidebar__opened_folders'

export default {
  name      : 'default',
  components: {
    'b-app-version': BAppVersion,
    'b-sidebar'    : BSidebar,
    'b-error-modal': BErrorModal,
  },
  data: () => ({
    navItems,
    openedFolders: getFromLocalStorage(SIDEBAR_STORE_KEY, []),
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
      return this.prepareNavItems(this.navItems)
    },
    pageTitle () {
      if (!this.customPageTitle) {
        const { username, displayName, loggedIn } = this.user
        const { name: routeName } = this.$route

        if (!loggedIn || routeName !== 'index')
          return this.getCurrentPageTitle(this.navItems)

        return `Welcome back, ${displayName || username}`
      }

      return this.customPageTitle
    },
  },
  watch: {
    '$route.name' () {
      this.$setPageTitle(null)
    },
    'openedFolders.length' () {
      setToLocalStorage(SIDEBAR_STORE_KEY, this.openedFolders)
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
      const notOnlineHosts = reject(this.updownStatus, { isOnline: true })

      this.$setSideBarNotifications('index', notOnlineHosts.length)
    },
    getCurrentPageTitle (navItems) {
      let title = ''

      each(navItems, (item) => {
        if (title) return false

        if (this.$route.name === item.name)
          title = item.title
        else if (item.children)
          title = this.getCurrentPageTitle(item.children)
      })

      return title
    },
    prepareNavItems (navItems) {
      const { scope: userScope } = this.user
      const currentNavItems = filter(navItems, (item) => {
        if (item.hidden) return false
        if (!item.scope) return true

        return userScope.includes(item.scope)
      })

      return map(currentNavItems, (item) => {
        if (!item.children)
          return item

        const isOpen = this.openedFolders.includes(item.title)

        return assign({ isOpen }, item)
      })
    },
    onFolderToggle (folder) {
      const folderId = folder.title

      if (folder.isOpen)
        this.openedFolders.push(folderId)
      else
        this.openedFolders = reject(this.openedFolders, openedId => openedId === folderId)
    },
    closeErrorModal (error) {
      this.$store.commit('REMOVE_ERROR', error)
    },
  },
}
</script>
