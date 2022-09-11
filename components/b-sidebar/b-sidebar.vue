<template>
  <div class="sidebar">
    <div class="sidebar__container">
      <div class="sidebar__title-container">
        <router-link class="flex justify-between items-center w-full" to="/">
          <nuxt-img
            preset="default"
            class="rounded-full ring-2 ring-indigo-300 shadow-xl"
            src="oib__orig__square.png"
            width="32"
            height="32"
          />

          <h1 class="sidebar__title ml-4">AGRABAH ADMIN</h1>
        </router-link>
      </div>

      <client-only>
        <nav class="sidebar__nav">
          <b-sidebar-item
            v-for="item in navItems"
            :key="item.title"
            :item="item"
          />
        </nav>

        <div class="sidebar__profile">
          <div v-if="user.loggedIn" class="flex flex-col-reverse">
            <b-user-info
              ref="userInfo"
              :user="user"
              class="sidebar__profile-user-info"
              avatar-class="!ring-indigo-500"
              avatar-size="medium"
            />
          </div>

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
}
</script>

<style lang='scss'>
@import 'b-sidebar';
</style>
