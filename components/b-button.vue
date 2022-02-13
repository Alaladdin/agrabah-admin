<template>
  <t-button v-bind="buttonProps" class="b-button" v-on="$listeners">
    <slot>
      <fa v-if="beforeIcon" :icon="beforeIcon" />
      <span v-if="text">{{ text }}</span>
      <fa v-if="afterIcon" :icon="afterIcon" />
    </slot>
  </t-button>
</template>

<script>
import { assign, omit } from 'lodash'

export default {
  name : 'b-button',
  props: {
    text: {
      type   : String,
      default: '',
    },
    beforeIcon: {
      type   : String,
      default: '',
    },
    afterIcon: {
      type   : String,
      default: '',
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
