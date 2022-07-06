<template>
  <label class="flex flex-col">
    <span
      v-if="label"
      class="mb-1.5 text-sm font-semibold text-gray-700 transition duration-100 ease-in-out"
      :class="{
        'opacity-60' : $attrs.disabled !== undefined,
        'text-red-900': variant.danger || variant === 'danger'
      }"
    >
      {{ label }}
    </span>

    <t-input
      ref="input"
      :value="value"
      :class="inputClass"
      :placeholder="placeholder"
      :variant="variant"
      :required="required"
      v-bind="allowedAttrs"
      @input="onInput"
    />
  </label>
</template>

<script>
import { omit } from 'lodash'

export default {
  name : 'b-input',
  props: {
    value: {
      type   : String,
      default: '',
    },
    label: {
      type   : String,
      default: '',
    },
    inputClass: {
      type   : [String, Array, Object],
      default: '',
    },
    placeholder: {
      type: String,
      default () {
        if (!this.label) return ''

        return 'Enter ' + this.label.toLowerCase()
      },
    },
    required: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    variant () {
      if (this.allowedAttrs.variant)
        return this.allowedAttrs.variant

      return (this.required && !this.value) ? 'danger' : ''
    },
    allowedAttrs () {
      return omit(this.$attrs, ['class', 'placeholder'])
    },
  },
  methods: {
    onInput (value) {
      this.$emit('input', value)
    },
  },
}
</script>
