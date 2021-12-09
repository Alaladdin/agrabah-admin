<template>
  <VMenu :disabled="disabled">
    <slot />

    <template #popper>
      <div class="flex justify-between items-center">
        <Avatar class="mr-7" :user="user" size="small" />

        <div>
          <p class="font-semibold">{{ user.username }}</p>
          <p class="text-xs text-gray-600">{{ user.scope[user.scope.length - 1] }}</p>
        </div>
      </div>
    </template>
  </VMenu>
</template>

<script>
export default {
  name : 'UserPopup',
  props: {
    user: {
      type   : Object,
      default: () => ({}),
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
}
</script>

<style lang='scss'>
.v-popper__inner {
  padding: 15px 18px !important;
}
</style>
