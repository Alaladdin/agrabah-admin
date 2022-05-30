<template>
  <div class="sidebar" :class="{ 'closed': !isMenuOpened }">
    <div class="sidebar__container">
      <div class="sidebar__title-container">
        <div class="flex justify-between items-center w-full">
          <nuxt-img
            preset="default"
            class="rounded-full ring-2 ring-indigo-300 shadow-xl"
            src="oib__orig__square.png"
            width="32"
            height="32"
          />

          <h1 v-if="isMenuOpened" class="sidebar__title ml-4">AGRABAH ADMIN</h1>
        </div>
        <b-button
          class="sidebar__toggler"
          variant="indigo"
          :before-icon="isMenuOpened ? 'angle-left' : 'angle-right'"
          @click="toggleMenu"
        />
      </div>

      <client-only>
        <nav class="sidebar__nav">
          <b-sidebar-item
            v-for="item in navItems"
            :key="item.title"
            :item="item"
            :item-clicked="itemClicked"
            :is-active="item.name === $route.name"
            :is-menu-opened="isMenuOpened"
          >
            <template #nested-items>
              <b-sidebar-item
                v-for="childItem in item.children"
                :key="childItem.name"
                :item="childItem"
                :item-clicked="itemClicked"
                :is-active="childItem.name === $route.name"
                :is-menu-opened="isMenuOpened"
              />
            </template>
          </b-sidebar-item>
        </nav>

        <div class="sidebar__profile">
          <div v-if="user.loggedIn" class="flex" :class="isMenuOpened ? 'flex-col-reverse' : 'flex-col'">
            <b-user-info
              ref="userInfo"
              :user="user"
              :class="{ 'invisible': !isMenuOpened }"
              class="sidebar__profile-user-info"
              avatar-class="!ring-indigo-500"
              avatar-size="medium"
            />

            <b-avatar
              :class="{ 'invisible': isMenuOpened }"
              class="sidebar__profile-user-info !mr-0 cursor-pointer"
              image-class="!ring-indigo-500"
              :user="user"
              size="extraSmall"
              @click="goToUserProfile"
            />
          </div>
          <b-button
            class="sidebar__profile-button"
            :to="buttonData.to"
            :text="isMenuOpened ? buttonData.text : ''"
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
import { getFromLocalStorage, setToLocalStorage } from '@/helpers'

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
  data: () => ({
    isMenuOpened: getFromLocalStorage('is_menu_opened', true),
  }),
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
    toggleMenu () {
      this.isMenuOpened = !this.isMenuOpened
      setToLocalStorage('is_menu_opened', this.isMenuOpened)
    },
    goToUserProfile () {
      this.$refs.userInfo.goToUserProfile()
    },
  },
}
</script>

<style lang='scss'>
@import 'b-sidebar';
</style>
