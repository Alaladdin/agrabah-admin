<template>
  <div
    ref="contextMenu"
    :class="['b-context-menu', { 'invisible' : !isVisible }]"
    :style="{ transform: `translate(${contextMenuPosition.x}px, ${contextMenuPosition.y}px)` }"
    @contextmenu.capture.prevent
  >
    <div class="b-context-menu__body">
      <div v-for="(button, i) in buttons" :key="i" v-clickaway="hideContextMenu">
        <hr v-if="button.divider">

        <div
          v-if="button.type !== 'user'"
          :class="['b-context-menu__item', button.class, { 'disabled': button.disabled }]"
          @click="!button.disabled && onClick(button.callback)"
        >
          <fa :icon="button.icon" class="mr-2" />
          <span>{{ button.title }}</span>
        </div>

        <b-user-info
          v-if="button.type === 'user'"
          class="p-3"
          :user="button.user"
          avatar-size="extraSmall"
        />
        <hr v-if="button.dividerAfter">
      </div>
    </div>
  </div>
</template>

<script>
import { directive as onClickAway } from 'vue-clickaway'
import { mapGetters, mapMutations } from 'vuex'
import BUserInfo from '@/components/b-user-info'

export default {
  name      : 'b-context-menu',
  directives: { clickaway: onClickAway },
  components: {
    'b-user-info': BUserInfo,
  },
  data: () => ({
    offset    : 20,
    baseWidth : 160,
    baseHeight: 160,
  }),
  computed: {
    ...mapGetters('context-menu', {
      buttons  : 'getButtons',
      position : 'getPosition',
      isVisible: 'getIsVisible',
    }),

    contextMenuPosition () {
      if (process.client) {
        const { contextMenu } = this.$refs
        const width = contextMenu?.clientWidth || this.baseWidth
        const height = contextMenu?.clientHeight || this.baseHeight

        const { x: posX, y: posY } = this.position
        const hasSpaceX = window.innerWidth + this.offset > width + posX
        const hasSpaceY = window.innerHeight + this.offset > height + posY

        return {
          x: posX - (hasSpaceX ? 0 : width),
          y: posY - (hasSpaceY ? 0 : height),
        }
      }

      return this.position
    },
  },
  created () {
    if (process.client)
      this.setEventListeners()
  },
  beforeDestroy () {
    this.removeEventListeners()
  },
  methods: {
    ...mapMutations('context-menu', { commitSetVisibility: 'SET_VISIBILITY' }),

    setEventListeners () {
      window.addEventListener('scroll', this.hideContextMenu)
      window.addEventListener('resize', this.hideContextMenu)
    },
    removeEventListeners () {
      window.removeEventListener('scroll', this.hideContextMenu)
      window.removeEventListener('resize', this.hideContextMenu)
    },
    onClick (buttonCallback) {
      buttonCallback()
      this.hideContextMenu()
    },
    hideContextMenu () {
      this.commitSetVisibility(false)
    },
  },
}
</script>

<style lang='scss'>
@import "b-context-menu";
</style>
