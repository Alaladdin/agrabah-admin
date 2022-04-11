<template>
  <t-modal class="b-change-info-plain-modal" :value="value" @closed="onClose">
    <template #header>
      <div class="flex items-center">
        <p class="mr-3">{{ capitalize(change.title) }}</p>
        <p class="text-xs text-gray-400">{{ change.changedAt }}</p>
      </div>
    </template>

    <b-change-info-plain :change="change" />
  </t-modal>
</template>

<script>
import { capitalize } from 'lodash'

export default {
  name      : 'b-change-info-plain-modal',
  components: {
    'b-change-info-plain': () => import('./b-change-info-plain'),
  },
  props: {
    value: {
      type   : Boolean,
      default: false,
    },
    change: {
      type   : Object,
      default: () => ({}),
    },
  },
  methods: {
    capitalize,
    onClose () {
      this.$emit('input', false)
      this.$emit('closed')
    },
  },
}
</script>

<style lang='scss'>
.b-change-info-plain-modal .modal__wrapper {
  @apply max-w-1/2 h-1/2;
}
</style>
