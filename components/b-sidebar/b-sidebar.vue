<template>
  <div class="sidebar">
    <div class="sidebar__container">
      <div class="sidebar__title-container">
        <h1 class="sidebar__title">AGRABAH ADMIN</h1>
      </div>

      <client-only>
        <nav class="sidebar__nav">
          <b-sidebar-item
            v-for="item in navItems"
            :key="item.path || item.title"
            :item="item"
            :item-clicked="itemClicked"
            :is-active="item.path === $route.path"
          >
            <template #nested-items>
              <b-sidebar-item
                v-for="childItem in item.children"
                :key="childItem.path"
                :item="childItem"
                :item-clicked="itemClicked"
                :is-active="childItem.path === $route.path"
              />
            </template>
          </b-sidebar-item>
        </nav>

        <div class="sidebar__profile">
          <div class="flex justify-between items-center p-3">
            <b-avatar
              :image-class="['sidebar__profile-avatar', { 'cursor-pointer' : user.loggedIn }]"
              :url="user.avatar"
              size="medium"
              @click="goToProfile"
            />

            <div class="flex flex-col select-none">
              <span class="text-md font-semibold truncate overflow-hidden max-w-25">
                {{ user.displayName || user.username }}
              </span>
            </div>
          </div>

          <b-button
            class="sidebar__profile-button"
            :to="user.loggedIn ? '/logout' : '/login'"
            :after-icon="user.loggedIn ? 'right-from-bracket' : 'right-to-bracket'"
            variant="indigo"
          />
        </div>

        <template #placeholder>
          <b-sidebar-loader />
        </template>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BSidebarItem from './b-sidebar-item'
import BSidebarLoader from './b-sidebar-loader'
import BAvatar from '@/components/b-avatar'
import BButton from '@/components/b-button'

export default {
  name      : 'b-sidebar',
  components: {
    'b-avatar'        : BAvatar,
    'b-button'        : BButton,
    'b-sidebar-item'  : BSidebarItem,
    'b-sidebar-loader': BSidebarLoader,
  },
  props: {
    navItems: {
      type   : Array,
      default: () => ([]),
    },
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),
  },
  methods: {
    goToProfile () {
      if (this.user.loggedIn)
        this.goToPage({ path: '/me' })
    },
    itemClicked (item) {
      item.children
        ? this.toggleFolder(item)
        : this.goToPage(item)
    },
    goToPage (item) {
      this.$emit('item-clicked', item)
    },
    toggleFolder (folder) {
      folder.isOpen = !folder.isOpen

      this.$emit('folder-toggled', folder)
    },
  },
}
</script>
