<template>
  <div class="b-sidebar-loader">
    <div class="flex flex-col justify-between h-full pointer-events-none">
      <div class="px-4 w-full">
        <div class="flex flex-col animate-pulse">
          <div v-for="(widthStyle, i) in randomWidthsStyles" :key="i" class="nuxt-link b-sidebar-loader__nav-item !justify-start !items-center">
            <span class="p-1.5 rounded bg-white" :style="widthStyle" />
          </div>
        </div>
      </div>

      <div class="sidebar__profile-button justify-center !p-3 m-4 animate-pulse">
        <fa icon="circle-notch" class="text-indigo-200 animate-spin" />
      </div>
    </div>
  </div>
</template>

<script>
import reject from 'lodash/reject'
import { getRandomNumber } from '@/helpers'
import { navItems } from '@/data'

export default {
  name    : 'b-sidebar-loader',
  computed: {
    navItemsCount () {
      const visibleNavItems = reject(navItems, { hidden: true })

      return visibleNavItems.length
    },
    randomWidthsStyles () {
      const widthsStyles = []

      for (let i = 0; i < this.navItemsCount; i++) {
        const width = getRandomNumber(30, 80)

        widthsStyles.push({ width: width + '%' })
      }

      return widthsStyles
    },
  },
}
</script>

<style lang='scss'>
@import "b-sidebar-loader";
</style>
