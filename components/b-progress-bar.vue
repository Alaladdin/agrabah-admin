<template>
  <div class="flex items-center">
    <div class="progress">
      <div class="progress__bar" :class="progressBarClass" :style="`width: ${value}%`" />
    </div>
    <div class="progress__text">{{ text || value + '%' }}</div>
  </div>
</template>

<script>
export default {
  name : 'b-progress-bar',
  props: {
    value: {
      type     : [Number, String],
      default  : 0,
      validator: v => v >= 0 && v <= 100,
    },
    text: {
      type   : String,
      default: '',
    },
    reverseColors: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    progressBarClass () {
      const prefix = 'progress__bar--'

      if (this.value <= 40)
        return prefix + (this.reverseColors ? 'high' : 'low')

      if (this.value >= 70)
        return prefix + (this.reverseColors ? 'low' : 'high')

      return prefix + 'medium'
    },
  },
}
</script>
