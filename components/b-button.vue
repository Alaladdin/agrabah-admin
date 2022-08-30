<template>
  <t-button v-bind="buttonProps" class="b-button" v-on="!buttonProps.disabled && $listeners">
    <slot>
      <span
        v-if="color"
        class="rounded w-2 h-2"
        :style="{ backgroundColor: color }"
      />

      <div v-if="loading">
        <fa icon="circle-notch" class="animate-spin" />
      </div>

      <template v-if="!loading">
        <fa v-if="beforeIcon" :icon="beforeIcon" />
        <span v-if="text" :class="textClass">{{ text }}</span>
        <fa v-if="afterIcon" :icon="afterIcon" />
      </template>
    </slot>
  </t-button>
</template>

<script>
import { assign, omit } from 'lodash'

export default {
  name : 'b-button',
  props: {
    text: {
      type   : [String, Array],
      default: '',
    },
    textClass: {
      type   : String,
      default: '',
    },
    color: {
      type   : String,
      default: '',
    },
    beforeIcon: {
      type   : [String, Array],
      default: '',
    },
    afterIcon: {
      type   : [String, Array],
      default: '',
    },
    loading: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    buttonProps () {
      const props = omit(this.$props, ['text'])

      return assign({}, props, this.$attrs)
    },
  },
}
</script>
