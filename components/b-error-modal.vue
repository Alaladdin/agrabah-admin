<template>
  <t-modal
    :value="!!text"
    header="Error"
    variant="danger"
    @closed="onCloseModal"
  >
    <div class="flex items-center">
      <div class="flex items-center justify-center rounded-full h-10 w-10 bg-red-200 text-lg">
        <fa icon="triangle-exclamation" />
      </div>

      <p class="ml-4 whitespace-pre-line">{{ text }}</p>
    </div>
  </t-modal>
</template>

<script>
export default {
  name : 'b-error-modal',
  props: {
    text: {
      type   : String,
      default: '',
    },
  },
  methods: {
    onCloseModal () {
      this.$emit('closed')
    },
  },
}
</script>
