<template>
  <button :class="buttonClass" :disabled="disabled" @click="onClick">
    <fa v-if="iconBefore" :icon="iconBefore" />
    <span v-if="text" :class="{ 'ml-3': iconBefore, 'mr-3': iconAfter }">{{ text }}</span>
    <fa v-if="iconAfter" :icon="iconAfter" />
  </button>
</template>

<script>
export default {
  name : 'Button',
  props: {
    text: {
      type   : String,
      default: '',
    },
    btnStyle: {
      type   : String,
      default: '',
    },
    iconBefore: {
      type   : String,
      default: '',
    },
    iconAfter: {
      type   : String,
      default: '',
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    buttonClass () {
      if (!this.btnStyle) return 'btn'

      return ['btn', `btn--${this.btnStyle}`]
    },
  },
  methods: {
    onClick () {
      this.$emit('click')
    },
  },
}
</script>
