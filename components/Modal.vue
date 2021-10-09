<template>
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <template v-if="type === 'error'">
              <div class="flex flex-shrink-0 items-center justify-center mx-auto h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </template>

            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="whitespace-pre-line text-sm text-gray-500">{{ text }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-end">
          <button v-if="btnText" class="modal__btn" :class="`modal__btn--${actionBtnStyle}`" @click="onAction">
            {{ btnText }}
          </button>
          <button class="modal__btn" @click="onCancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'Modal',
  props: {
    show: {
      type    : Boolean,
      default : false,
      required: false,
    },
    title: {
      type   : String,
      default: 'Error',
    },
    text: {
      type   : String,
      default: 'Unexpected error',
    },
    btnText: {
      type   : String,
      default: '',
    },
    type: {
      type    : String,
      default : 'error',
      validate: v => ['error', 'success', 'warning'].includes(v),
    },
  },
  computed: {
    actionBtnStyle () {
      const classesRules = {
        error  : 'danger',
        success: 'success',
        warn   : 'warning',
      }

      return classesRules[this.type] || ''
    },
  },
  methods: {
    onAction () {
      this.$emit('action-called')
    },
    onCancel () {
      this.$emit('close-modal', this.text)
    },
  },
}
</script>
