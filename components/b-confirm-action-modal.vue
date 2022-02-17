<template>
  <t-dialog
    :value="value"
    :title="title"
    :pre-confirm="onConfirm"
    type="confirm"
    icon="question"
    @change="onInput"
  />
</template>

<script>
export default {
  name : 'b-confirm-action-modal',
  props: {
    value: {
      type   : Boolean,
      default: false,
    },
    title: {
      type   : String,
      default: '',
    },
    onConfirm: {
      type   : Function,
      default: () => {},
    },
  },
  methods: {
    onInput (value) {
      this.$emit('input', value)
    },
  },
}
</script>
