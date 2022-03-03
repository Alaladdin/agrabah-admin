<template>
  <div class="cursor-pointer select-none" :class="additionalClasses" @click="onInput">
    <fa :icon="checkboxIcon" />

    <slot>
      <span class="ml-1">{{ text }}</span>
    </slot>
  </div>
</template>

<script>
import { concat, isArray, reject } from 'lodash'

export default {
  name : 'b-checkbox',
  model: {
    prop : 'checked',
    event: 'input',
  },
  props: {
    checked: {
      type   : [Boolean, Array],
      default: false,
    },
    value: {
      type   : String,
      default: '',
    },
    text: {
      type   : String,
      default: '',
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    isCheckboxArray () {
      return !isArray(this.checked)
    },
    isChecked () {
      if (this.isCheckboxArray)
        return this.checked

      return this.checked.includes(this.value)
    },
    checkboxIcon () {
      return this.isChecked ? 'square-check' : 'square'
    },
    additionalClasses () {
      const classList = []

      if (this.disabled)
        classList.push('text-gray-800', 'opacity-50')
      else
        classList.push('text-indigo-500')

      return classList
    },
  },
  methods: {
    onInput () {
      if (this.disabled) return

      !this.isCheckboxArray
        ? this.emitArray()
        : this.emitInput(!this.isChecked)
    },
    emitArray () {
      let newArray

      if (this.isChecked)
        newArray = reject(this.checked, value => value === this.value)
      else
        newArray = concat(this.checked, [this.value])

      this.emitInput(newArray)
    },
    emitInput (value) {
      this.$emit('input', value)
    },
  },
}
</script>
