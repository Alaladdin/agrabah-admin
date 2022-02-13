<template>
  <div class="sidebar">
    <div class="sidebar__container">
      <div class="sidebar__title-container">
        <h1 class="sidebar__title">AGRABAH ADMIN</h1>
      </div>

      <nav class="sidebar__nav">
        <b-sidebar-item
          v-for="navItem in currentNavItems"
          :key="navItem.path"
          :nav-item="navItem"
        />
      </nav>

      <div class="sidebar__profile">
        <div class="flex justify-center items-center p-3">
          <avatar
            :image-class="['sidebar__profile-avatar', { 'cursor-pointer' : user.loggedIn }]"
            :user="user"
            size="medium"
            @click="goToProfile"
          />

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
import { filter, some } from 'lodash'

export default {
  name : 'b-sidebar',
  props: {
    navItems: {
      type   : Array,
      default: () => ([]),
    },
  },
  computed: {
    ...mapGetters({
      user               : 'getUserData',
      navbarNotifications: 'getNavbarNotifications',
    }),

    currentNavItems () {
      const { scope: userScope } = this.user

      return filter(this.navItems, (navItem) => {
        if (!navItem.scope) return true
        if (navItem.hidden) return false

        return some(navItem.scope, navScopeItem => userScope.includes(navScopeItem))
      })
    },
  },
  methods: {
    goToProfile () {
      if (this.user.loggedIn)
        this.$router.push('/me')
    },
  },
}
</script>
