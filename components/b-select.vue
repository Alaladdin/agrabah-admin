<template>
  <b-dropdown
    :text="selectedOption.text"
    :color="selectedOption.color"
    :options="options"
    :button-class="buttonClass"
    :variant="variant"
    :disabled="disabled"
    @input="onSelect"
  />
</template>

<script>
import { find } from 'lodash/collection'
import BDropdown from '@/components/b-dropdown'

export default {
  name      : 'b-select',
  components: {
    'b-dropdown': BDropdown,
  },
  props: {
    value: {
      type   : String,
      default: '',
    },
    options: {
      type   : Array,
      default: () => ([]),
    },
    buttonClass: {
      type   : String,
      default: '',
    },
    variant: {
      type   : String,
      default: '',
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    selectedOption () {
      const selectedOption = find(this.options, { value: this.value })

      if (!selectedOption)
        return {}

      return {
        text : selectedOption.title,
        color: selectedOption.color,
        value: selectedOption.value,
      }
    },
  },
  methods: {
    onSelect (value) {
      this.onInput(value)

      if (this.value !== value)
        this.onChange(value)
    },
    onInput (value) {
      this.$emit('input', value)
    },
    onChange (value) {
      this.$emit('change', value)
    },
  },
}
</script>
