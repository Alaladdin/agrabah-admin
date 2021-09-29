<template>
  <div class="flex w-full h-full">
    <div class="flex justify-between mb-3 w-full h-2/5">
      <textarea v-model="actuality.content" :class="['textarea', { 'bg-yellow-50': !isLoading && isActualityEdited.content }, 'mr-3']" :disabled="isEditDisabled" />
      <textarea v-model="actuality.lazyContent" :class="['textarea', { 'bg-yellow-50': !isLoading && isActualityEdited.lazyContent }]" :disabled="isEditDisabled" />
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="inline-block px-4 py-1 rounded leading-normal shadow-sm bg-indigo-200 text-indigo-600 text-sm font-semibold" role="alert">
        <p>{{ updatedAtText }}</p>
      </div>

      <div class="flex">
        <Button class="mr-3" text="Post VK" :loading="isPosting" :disabled="isPostDisabled" @click="postActuality" />
        <Button text="Update" btn-style="indigo" :loading="isUpdating" :disabled="isEditDisabled" @click="updateActuality" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone, filter, each } from 'lodash'

export default {
  name: 'Actuality',
  data () {
    return {
      actuality      : {},
      editedActuality: [false, false],
      isLoading      : true,
      isPosting      : false,
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
    isEditDisabled () {
      return this.isLoading || this.isUpdating || this.isPosting
    },
    isPostDisabled () {
      if (!this.inActuality) return false

      const { content, lazyContent } = this.inActuality
      const notEmptyActualities = filter(Object.values({ content, lazyContent }, act => act && act.trim()))

      return this.isUpdating || this.isPosting || !notEmptyActualities.length
    },
  },
  created () {
    this.loadActualityData()
  },
  methods: {
    ...mapActions('actuality', ['loadActuality', 'setActuality']),
    ...mapActions('vk', ['sendMessage']),

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
    postActuality () {
      const { content, lazyContent } = this.inActuality
      const actualities = Object.values({ content, lazyContent })

      each(actualities, (actuality) => {
        this.isPosting = true

        this.sendMessage({ message: actuality })
          .catch(console.error)
          .finally(() => {
            this.isPosting = false
          })
      })
    },
  },
}
</script>
