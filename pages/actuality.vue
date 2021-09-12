<template>
  <div class="flex w-full h-full">
    <div class="flex justify-between mb-3 w-full h-2/5">
      <textarea v-model="actuality.content" :class="[textareaClasses, 'mr-3']" />
      <textarea v-model="actuality.lazyContent" :class="textareaClasses" />
    </div>

    <div class="flex justify-between items-center rounded">
      <div class="inline-block px-4 py-1 rounded leading-normal shadow-sm bg-indigo-200 text-indigo-600 text-sm font-semibold" role="alert">
        <p>{{ updatedAtText }}</p>
      </div>

      <button class="btn btn--indigo" :disabled="isButtonsDisabled" @click="updateActuality">
        Update
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone } from 'lodash'

export default {
  name: 'Actuality',
  data () {
    return {
      actuality      : {},
      isLoading      : true,
      isUpdating     : false,
      isGettingError : false,
      textareaClasses: 'w-full px-3 py-2 border rounded text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none',
    }
  },
  computed: {
    ...mapGetters('actuality', ['getActuality']),

    updatedAtText () {
      if (this.isLoading || this.isGettingError) return '...'

      return `Updated at ${this.actuality.date}`
    },
    isButtonsDisabled () {
      return this.isLoading || this.isUpdating
    },
  },
  created () {
    this.loadActualityData()
  },
  methods: {
    ...mapActions('actuality', ['loadActuality', 'setActuality']),

    loadActualityData () {
      this.isLoading = true

      this.loadActuality()
        .then(this.getActualityData)
        .catch((err) => {
          this.isGettingError = true
          console.error(err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getActualityData () {
      this.actuality = clone(this.getActuality)
    },
    updateActuality () {
      const { content, lazyContent } = this.actuality

      this.setActuality({ content, lazyContent })
        .catch(console.error)
    },
  },
}
</script>
