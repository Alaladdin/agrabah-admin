<template>
  <div class="flex justify-between items-center">
    <Avatar class="mr-5" :user="user" size="small" />

    <div>
      <p class="font-semibold">{{ user.username }}</p>
      <p class="text-xs text-gray-600">{{ user.scope[user.scope.length - 1] }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name : 'UserInfo',
  props: {
    user: {
      type   : Object,
      default: () => ({}),
    },
  },
}
</script>
