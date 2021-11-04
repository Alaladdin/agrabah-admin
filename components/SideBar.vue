<template>
  <div class="sidebar">
    <div class="sidebar__container">
      <div class="sidebar__title-container">
        <h1 class="sidebar__title">MPEI ADMIN</h1>
      </div>
      <nav class="sidebar__nav">
        <NuxtLink v-for="(item, index) in navItems" :key="index" :to="item.path" :class="['nuxt-link', { 'disabled' : item.disabled }]">
          <div>
            <fa class="mr-3 text-indigo-100" :icon="item.icon" />
            <span class="mr-1">{{ item.title }}</span>
          </div>
          <span v-if="getNotificationsCount(item)" class="sidebar__nav-title">
            <span>{{ getNotificationsCount(item) }}</span>
          </span>
        </NuxtLink>
      </nav>

      <ul v-show="isShowProfileContext" class="options-popup">
        <li v-for="(item, index) in profileContextMenu" :key="index" class="options-popup__item" @click="profileContextClick(item)">
          {{ item.title }}
        </li>
      </ul>

      <div class="sidebar__profile">
        <div class="flex justify-center items-center p-3">
          <img v-on-clickaway="closeProfileContext" class="sidebar__profile-avatar" src="~/assets/img/avatar__default.jpg" :alt="user.username" @click="openProfileContext">

          <div class="flex flex-col mr-5 select-none">
            <span class="text-md font-semibold">{{ user.username }}</span>
          </div>
        </div>

        <NuxtLink :to="user.loggedIn ? '/logout' : '/login'" class="sidebar__profile-button">
          <fa :icon="user.loggedIn ? 'sign-out-alt' : 'sign-in-alt'" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import { find, filter, keys, some } from 'lodash'
import { navItems } from '@/data'

export default {
  name  : 'SideBar',
  mixins: [clickaway],
  data () {
    return {
      profileContextMenu: [
        { title: 'Profile', name: 'me' },
        { title: 'Logout', name: 'logout' },
      ],
      isShowProfileContext: false,
    }
  },
  computed: {
    ...mapGetters({
      user               : 'getUserData',
      navbarNotifications: 'getNavbarNotifications',
    }),

    navItems () {
      const { scope: userScope } = this.user

      return filter(navItems, (navItem) => {
        if (!navItem.scope) return true

        return some(navItem.scope, navSingleScope => userScope.includes(navSingleScope))
      })
    },
  },
  methods: {
    getNotificationsCount (navItem) {
      const notificationsKeys = keys(this.navbarNotifications)
      const key = find(notificationsKeys, key => key === navItem.title.toLowerCase())

      return this.navbarNotifications[key] || 0
    },
    profileContextClick (item) {
      this.closeProfileContext()
      this.$router.push(item)
    },
    openProfileContext () {
      if (this.user.loggedIn)
        this.isShowProfileContext = true
    },
    closeProfileContext () {
      this.isShowProfileContext = false
    },
  },
}
</script>
