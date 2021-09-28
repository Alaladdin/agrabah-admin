<template>
  <button :class="buttonClass" :disabled="disabled" @click="onClick">
    <Loader v-if="loading" class="box-content" />
    <fa v-if="iconBefore" :icon="iconBefore" />
    <span v-if="text && !loading" :class="{ 'ml-3': iconBefore, 'mr-3': iconAfter }">{{ text }}</span>
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
    loading: {
      type   : Boolean,
      default: false,
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    buttonClass () {
      const classes = ['btn']

      if (this.loading) classes.push('flex', 'items-center')
      if (this.btnStyle) classes.push(`btn--${this.btnStyle}`)

      return classes
    },
  },
  methods: {
    onClick () {
      this.$emit('click')
    },
  },
}
</script>
