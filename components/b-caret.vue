<template>
  <b-button
    class="transform"
    :class="{ 'rotate-180': isInvertedAnimation ? value : !value }"
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
    isInvertedAnimation: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    caretIcon () {
      return this.isInvertedAnimation ? 'caret-down' : 'caret-up'
    },
  },
  methods: {
    toggleCaret () {
      this.$emit('input', !this.value)
    },
  },
}
</script>
