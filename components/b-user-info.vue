<template>
  <div class="grid grid-cols-2 gap-4 justify-between items-center">
    <b-avatar :url="userData.avatar" :size="avatarSize" />

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
      type    : Object,
      required: true,
    },
    avatarSize: {
      type   : String,
      default: 'small',
    },
  },
  computed: {
    userData () {
      if (this.user)
        return pick(this.user, ['username', 'displayName', 'scope', 'avatar'])

      return {
        username: 'DELETED',
        scope   : [],
        avatar  : 'no-user-avatar',
      }
    },
  },
  methods: {
    last,
  },
}
</script>
