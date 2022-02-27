<template>
  <div class="flex justify-between items-center w-min-content">
    <b-avatar class="mr-4" :url="user.avatar" :size="avatarSize" />

    <div>
      <p class="font-semibold">{{ user ? user.username : 'DELETED' }}</p>
      <p class="text-xs text-gray-600">{{ last(user ? user.scope : []) }}</p>
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
      type    : Object,
      required: true,
    },
    avatarSize: {
      type   : String,
      default: 'small',
    },
  },
  methods: {
    last,
  },
}
</script>
