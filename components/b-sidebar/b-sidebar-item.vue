<template>
  <div>
    <a class="nuxt-link w-full" :class="{ 'active': isActive, 'disabled': item.disabled }" @click="itemClicked(item)">
      <div>
        <fa class="mr-3 !w-4 text-indigo-100" :icon="navIcon" />
        <span class="mr-1">{{ item.title }}</span>
      </div>

      <span v-if="notificationsCount" class="sidebar__nav-badge">
        {{ notificationsCount }}
      </span>

      <fa v-if="item.children" :icon="item.isOpen ? 'caret-up' : 'caret-down'" />
    </a>

    <client-only>
      <div v-if="item.isOpen" class="pl-4">
        <slot name="nested-items" />
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name : 'b-sidebar-item',
  props: {
    item: {
      type   : Object,
      default: () => ({}),
    },
    itemClicked: {
      type   : Function,
      default: () => {},
    },
    isActive: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({ navbarNotifications: 'getNavbarNotifications' }),

    notificationsCount () {
      if (this.isFolder) return 0

      const navRouterData = this.$router.resolve(this.item.path)
      const { name: navRouterName } = navRouterData.route

      return this.navbarNotifications[navRouterName] || 0
    },
    navIcon () {
      const { icon, isOpen } = this.item

      if (icon) return icon

      return isOpen ? 'folder-open' : 'folder'
    },
    isFolder () {
      return this.item.children
    },
  },
}
</script>
