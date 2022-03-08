<template>
  <div class="b-sidebar-loader">
    <div class="flex flex-col justify-between h-full">
      <div class="px-4 w-full">
        <div class="flex flex-col animate-pulse">
          <div v-for="i in 12" :key="i" class="nuxt-link b-sidebar-loader__nav-item" />
        </div>
      </div>

      <div class="sidebar__profile p-3 w-full">
        <div class="sidebar__profile-avatar b-sidebar-loader__avatar" />
        <div class="b-sidebar-loader__username" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-sidebar-loader',
}
</script>

<style lang='scss'>
@import "b-sidebar-loader";
</style>
