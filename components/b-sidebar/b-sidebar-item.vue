<template>
  <nuxt-link class="nuxt-link" :class="{ 'disabled': navItem.disabled }" :to="navItem.path">
    <div>
      <fa class="mr-3 text-indigo-100" :icon="navItem.icon" />
      <span class="mr-1">{{ navItem.title }}</span>
    </div>

    <span v-if="notificationsCount" class="sidebar__nav-title">
      {{ notificationsCount }}
    </span>
  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name : 'b-sidebar-item',
  props: {
    navItem: {
      type   : Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({ navbarNotifications: 'getNavbarNotifications' }),

    notificationsCount () {
      const navRouterData = this.$router.resolve(this.navItem.path)
      const { name: navRouterName } = navRouterData.route

      return this.navbarNotifications[navRouterName] || 0
    },
  },
}
</script>
