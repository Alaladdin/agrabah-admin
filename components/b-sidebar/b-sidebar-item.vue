<template>
  <div class="sidebar__item">
    <div
      v-if="item.needDivider"
      class="mt-2 bg-indigo-500 rounded-full h-1px"
    />

    <a
      class="nuxt-link w-full"
      :class="{
        'active': isActive,
        'disabled': item.disabled,
        '!hidden': isFolder && !isMenuOpened
      }"
      @click="itemClicked(item)"
    >
      <div>
        <fa class="mr-3 !w-4 text-indigo-100" :icon="navIcon" />
        <span class="sidebar__item-title">{{ item.title }}</span>
      </div>

      <span v-if="isMenuOpened && notificationsCount" class="sidebar__nav-badge">
        {{ notificationsCount }}
      </span>

      <b-caret v-if="isFolder" :value="item.isOpen" is-inverted-animation />
    </a>

    <client-only>
      <div v-if="!isMenuOpened || item.isOpen" class="sidebar__item--nested">
        <slot name="nested-items" />
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BCaret from '@/components/b-caret'

export default {
  name      : 'b-sidebar-item',
  components: {
    'b-caret': BCaret,
  },
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
    isMenuOpened: {
      type   : Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters({ navbarNotifications: 'getNavbarNotifications' }),

    notificationsCount () {
      if (!this.isFolder) {
        const itemNotifications = this.navbarNotifications[this.item.name]

        if (itemNotifications)
          return itemNotifications
      }

      return 0
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
