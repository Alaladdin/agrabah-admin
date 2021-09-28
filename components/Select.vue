<template>
  <div class="text-gray-700">
    <select v-model="localValue" class="h-9 pl-3 pr-5 rounded focus:outline-none">
      <option v-for="(option, index) in options" :key="index" :value="option.value">
        {{ option.title }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name : 'Select',
  props: {
    value: {
      type   : [Number, String],
      default: null,
    },
    options: {
      type   : Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      localValue: this.value,
    }
  },
  watch: {
    value (v) {
      this.localValue = v
    },
    localValue (v) {
      this.$emit('input', v)
    },
  },
}
</script>
