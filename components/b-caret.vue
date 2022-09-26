<template>
  <b-button
    class="transform"
    :class="{ 'rotate-180': invertedAnimation ? value : !value }"
    :before-icon="caretIcon"
    style="color: inherit"
    variant="icon"
  />
</template>

<script>
import BButton from '@/components/b-button'

export default {
  name      : 'b-caret',
  components: {
    'b-button': BButton,
  },
  props: {
    value: {
      type   : Boolean,
      default: false,
    },
    invertedAnimation: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    caretIcon () {
      return this.invertedAnimation ? 'angle-down' : 'angle-up'
    },
  },
}
</script>
