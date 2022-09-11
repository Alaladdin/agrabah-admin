<template>
  <div class="sidebar__item">
    <div v-if="item.groupName" class="sidebar__item-group-title">
      {{ item.groupName }}
    </div>

    <a
      class="nuxt-link w-full"
      :class="{ 'active': isActive, 'disabled': item.disabled }"
      @click="itemClicked(item)"
    >
      <div>
        <fa class="mr-3 !w-4 text-indigo-100" :icon="item.icon" />
        <span class="sidebar__item-title">{{ item.title }}</span>
      </div>

      <span v-if="notificationsCount" class="sidebar__nav-badge">
        {{ notificationsCount }}
      </span>
    </a>
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
      return this.navbarNotifications[this.item.name]
    },
  },
}
</script>
