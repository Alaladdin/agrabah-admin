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

      <div class="sidebar__profile p-3 w-full">
        <b-avatar class="animate-pulse" image-class="sidebar__profile-avatar" size="medium" />
        <div class="b-sidebar-loader__username animate-pulse" />
      </div>
    </div>
  </div>
</template>

<script>
import { reduce, reject } from 'lodash'
import { getRandomInt } from '@/helpers'
import BAvatar from '@/components/b-avatar'
import { navItems } from '@/data'

export default {
  name      : 'b-sidebar-loader',
  components: {
    'b-avatar': BAvatar,
  },
  computed: {
    navItemsCount () {
      const rootNavItems = reject(navItems, { hidden: true })

      return reduce(rootNavItems, (sum, { children }) => sum + (!!children && children.length), rootNavItems.length)
    },
    randomWidthsStyles () {
      const widthsStyles = []

      for (let i = 0; i < this.navItemsCount; i++) {
        const width = getRandomInt(30, 80)

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
