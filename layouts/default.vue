<template>
  <div class="min-h-screen flex bg-gray-200">
    <b-sidebar
      :nav-items="currentNavItems"
      :is-loading="isLoading"
      @item-clicked="goToPage"
      @folder-toggled="onFolderToggle"
    />

    <div class="pl-64 flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <t-tag v-if="pageTitle" class="mb-10" variant="title" tag-name="h1">{{ pageTitle }}</t-tag>

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
  data () {
    return {
      navItems,
      openedFolders: getFromLocalStorage(SIDEBAR_STORE_KEY, []),
      isLoading    : true,
    }
  },
  computed: {
    ...mapGetters({
      user          : 'getUserData',
      errors        : 'getErrors',
      updownServices: 'updown/getUpdownServices',
    }),

    currentNavItems () {
      return this.prepareNavItems(this.navItems)
    },
    pageTitle () {
      const { username, loggedIn } = this.user
      const { path } = this.$route

      if (!loggedIn || path !== '/')
        return this.getCurrentPageTitle(this.navItems)

      return `Hi, ${username}`
    },
  },
  watch: {
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
        .finally(() => {
          this.isLoading = false
        })

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
    getCurrentPageTitle (navItems) {
      let title = ''

      each(navItems, (item) => {
        if (title) return false

        if (item.path === this.$route.path)
          title = item.title
        else if (item.children)
          title = this.getCurrentPageTitle(item.children)
      })

      return title
    },
    prepareNavItems (navItems) {
      const { scope: userScope } = this.user
      const currentNavItems = filter(navItems, (item) => {
        if (!item.scope) return true
        if (item.hidden) return false

        return userScope.includes(item.scope)
      })

      return map(currentNavItems, (item) => {
        if (!item.children)
          return item

        const isOpen = this.openedFolders.includes(item.title)

        return assign({ isOpen }, item)
      })
    },
    goToPage (item) {
      this.$router.push(item.path)
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
