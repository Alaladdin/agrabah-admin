<template>
  <div class="sidebar__item">
    <div v-if="item.groupName" class="sidebar__item-group-title">
      {{ item.groupName }}
    </div>

    <a
      class="nuxt-link w-full"
      :class="{
        'active': $route.name.includes(item.name),
        'disabled': item.disabled
      }"
      @click="goToPage"
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
  },
  computed: {
    ...mapGetters({ navbarNotifications: 'getNavbarNotifications' }),

    notificationsCount () {
      return this.navbarNotifications[this.item.name]
    },
  },
  methods: {
    goToPage () {
      this.$router.push({ name: this.item.name })
    },
  },
}
</script>
