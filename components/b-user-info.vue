<template>
  <div class="b-user-info flex space-x-4 items-center">
    <b-avatar
      :class="{ 'cursor-pointer': !!user }"
      :image-class="avatarClass"
      :user="userData"
      :size="avatarSize"
      @click="goToUserProfile"
    />

    <div class="max-w-1/2">
      <p class="truncate font-semibold">{{ userData.displayName || userData.username }}</p>
      <p class="text-xs text-gray-600">{{ last(userData.scope) }}</p>
    </div>
  </div>
</template>

<script>
import { last } from 'lodash'
import BAvatar from '@/components/b-avatar'

export default {
  name      : 'b-user-info',
  components: {
    'b-avatar': BAvatar,
  },
  props: {
    user: {
      type   : Object,
      default: () => ({}),
    },
    avatarSize: {
      type   : String,
      default: 'small',
    },
    avatarClass: {
      type   : String,
      default: '',
    },
  },
  computed: {
    userData () {
      if (this.user)
        return this.user

      return {
        username: 'DELETED',
        scope   : [],
        avatar  : this.$config.errorAvatarImage,
      }
    },
  },
  methods: {
    last,
    goToUserProfile () {
      if (this.user) {
        const { username } = this.user

        this.$router.push({ name: 'user/username', params: { username } })
      }
    },
  },
}
</script>

<style lang='scss'>
.b-user-info .b-avatar .b-avatar__status--online {
    @apply border-white;
}
</style>
