<template>
  <div class="flex w-full h-full">
    <div class="flex justify-between mb-3 w-full h-2/5">
      <textarea v-model="actuality.content" :class="['textarea', { 'bg-yellow-50': isActualityEdited.content }, 'mr-3']" />
      <textarea v-model="actuality.lazyContent" :class="['textarea', { 'bg-yellow-50': isActualityEdited.lazyContent }]" />
    </div>

    <div class="flex justify-between items-center rounded select-none">
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
      editedActuality: [false, false],
      isLoading      : true,
      isUpdating     : false,
      isGettingError : false,
    }
  },
  computed: {
    ...mapGetters('actuality', { inActuality: 'getActuality' }),

    updatedAtText () {
      if (this.isLoading || this.isGettingError) return '...'

      return `Updated at ${this.actuality.updatedAt}`
    },
    isActualityEdited () {
      const { content: inContent, lazyContent: inLazyContent } = this.inActuality || {}
      const { content, lazyContent } = this.actuality

      return {
        content    : inContent !== content,
        lazyContent: inLazyContent !== lazyContent,
      }
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
      this.actuality = clone(this.inActuality)
    },
    updateActuality () {
      const { content, lazyContent } = this.actuality

      this.isUpdating = true
      this.setActuality({ content, lazyContent })
        .then(this.getActualityData)
        .catch(console.error)
        .finally(() => {
          this.isUpdating = false
        })
    },
  },
}
</script>
