<template>
  <t-dropdown v-bind="$attrs">
    <slot />

    <template #trigger="{ mousedownHandler, blurHandler }">
      <b-button
        class="z-20"
        v-bind="buttonProps"
        after-icon="caret-down"
        @mousedown="mousedownHandler"
        @blur="blurHandler"
      />
    </template>
  </t-dropdown>
</template>

<script>
import { pick } from 'lodash/object'
import BButton from '@/components/b-button'

export default {
  name      : 'b-dropdown',
  components: {
    'b-button': BButton,
  },
  computed: {
    buttonProps () {
      return pick(this.$attrs, ['text', 'variant', 'disabled'])
    },
  },
}
</script>
