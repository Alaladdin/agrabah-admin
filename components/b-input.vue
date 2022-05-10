<template>
  <label class="flex flex-col">
    <span
      v-if="label"
      class="mb-1.5 text-sm font-semibold text-gray-700 transition duration-100 ease-in-out"
      :class="{
        'opacity-60' : $attrs.disabled !== undefined,
        'text-red-900': $attrs.variant && $attrs.variant.danger
      }"
    >
      {{ label }}
    </span>

    <t-input
      ref="input"
      :value="value"
      :class="inputClass"
      :placeholder="$attrs.placeholder || $props.label"
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
  },
  computed: {
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
