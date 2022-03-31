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
            :key="item.title"
            :item="item"
            :item-clicked="itemClicked"
            :is-active="item.name === $route.name"
          >
            <template #nested-items>
              <b-sidebar-item
                v-for="childItem in item.children"
                :key="childItem.name"
                :item="childItem"
                :item-clicked="itemClicked"
                :is-active="childItem.name === $route.name"
              />
            </template>
          </b-sidebar-item>
        </nav>

        <div class="sidebar__profile">
          <b-user-info
            v-if="user.loggedIn"
            :user="user"
            class="sidebar__profile-user-info"
            avatar-class="sidebar__profile-avatar"
            avatar-size="medium"
          />

          <b-button
            class="sidebar__profile-button"
            :to="buttonData.to"
            :text="buttonData.text"
            :after-icon="buttonData.icon"
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
import BButton from '@/components/b-button'
import BUserInfo from '@/components/b-user-info'

export default {
  name      : 'b-sidebar',
  components: {
    'b-user-info'     : BUserInfo,
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

    buttonData () {
      const { loggedIn } = this.user

      return {
        to  : loggedIn ? '/logout' : '/login',
        text: loggedIn ? 'Log out' : 'Log in',
        icon: loggedIn ? 'arrow-right-from-bracket' : 'arrow-right-to-bracket',
      }
    },
  },
  methods: {
    itemClicked (item) {
      item.children
        ? this.toggleFolder(item)
        : this.goToPage(item)
    },
    goToPage (item) {
      this.$router.push({ name: item.name })
    },
    toggleFolder (folder) {
      folder.isOpen = !folder.isOpen

      this.$emit('folder-toggled', folder)
    },
  },
}
</script>
