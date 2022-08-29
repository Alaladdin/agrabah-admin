<template>
  <t-alert
    class="!w-full"
    :class="{ 'alert---bordered': !borderless }"
    :variant="variant"
    :dismissible="dismissible"
    show
  >
    <slot>{{ text }}</slot>
  </t-alert>
</template>

<script>
export default {
  name : 'b-alert',
  props: {
    text: {
      type   : String,
      default: '',
    },
    variant: {
      type   : [String, Object],
      default: '',
    },
    borderless: {
      type   : Boolean,
      default: false,
    },
    dismissible: {
      type   : Boolean,
      default: false,
    },
  },
}
</script>
