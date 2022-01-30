<template>
  <div class="flex justify-between items-center w-min-content">
    <Avatar class="mr-4" :user="user" :size="avatarSize" />

    <div>
      <p class="font-semibold">{{ user ? user.username : 'DELETED' }}</p>
      <p class="text-xs text-gray-600">{{ last(user ? user.scope : []) }}</p>
    </div>
  </div>
</template>

<script>
import { last } from 'lodash'

export default {
  name : 'UserInfo',
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
