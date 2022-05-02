<template>
  <div
    v-show="isVisible"
    class="b-context-menu"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
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
  computed: {
    ...mapGetters('context-menu', {
      buttons  : 'getButtons',
      position : 'getPosition',
      isVisible: 'getIsVisible',
    }),
  },
  methods: {
    ...mapMutations('context-menu', { commitSetVisibility: 'SET_VISIBILITY' }),

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
