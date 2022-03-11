<template>
  <div class="b-sidebar-loader">
    <div class="flex flex-col justify-between h-full pointer-events-none">
      <div class="px-4 w-full">
        <div class="flex flex-col animate-pulse">
          <div v-for="i in 12" :key="i" class="nuxt-link b-sidebar-loader__nav-item !justify-start !items-center">
            <span class="p-1.5 rounded bg-white" :style="getRandomWidthStyle()" />
          </div>
        </div>
      </div>

      <div class="sidebar__profile p-3 w-full">
        <b-avatar class="animate-pulse" image-class="sidebar__profile-avatar" size="medium" />
        <div class="b-sidebar-loader__username animate-pulse" />
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomInt } from '@/helpers'

export default {
  name   : 'b-sidebar-loader',
  methods: {
    getRandomWidthStyle () {
      const width = getRandomInt(30, 80)

      return { width: width + '%' }
    },
  },
}
</script>

<style lang='scss'>
@import "b-sidebar-loader";
</style>
