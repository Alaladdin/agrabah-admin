<template>
  <div class="flex space-x-4 items-center">
    <b-avatar
      :class="{ 'cursor-pointer': user }"
      :image-class="avatarClass"
      :url="userData.avatar"
      :size="avatarSize"
      @click="goToUserProfile"
    />

    <div>
      <p class="font-semibold">{{ userData.displayName || userData.username }}</p>
      <p class="text-xs text-gray-600">{{ last(userData.scope) }}</p>
    </div>
  </div>
</template>

<script>
import { last, pick } from 'lodash'
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
        return pick(this.user, ['username', 'displayName', 'scope', 'avatar'])

      return {
        username: 'DELETED',
        scope   : [],
        avatar  : process.env.ERROR_AVATAR_IMAGE,
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
