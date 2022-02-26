<template>
  <t-modal
    :value="!!error"
    header="Error"
    variant="danger"
    @closed="onCloseModal"
  >
    <div class="flex items-center">
      <div class="flex items-center justify-center rounded-full h-10 w-10 bg-red-200 text-lg">
        <fa icon="triangle-exclamation" />
      </div>

      <p class="ml-4 whitespace-pre-line">{{ error }}</p>
    </div>
  </t-modal>
</template>

<script>
export default {
  name : 'b-error-modal',
  props: {
    error: {
      type   : String,
      default: '',
    },
  },
  methods: {
    onCloseModal () {
      this.$emit('closed', this.error)
    },
  },
}
</script>
