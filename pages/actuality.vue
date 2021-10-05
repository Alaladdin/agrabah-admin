<template>
  <div class="flex w-full">
    <div class="flex justify-between mb-3 w-full h-85">
      <label class="flex flex-col mr-3 w-full h-full">
        <div class="textarea__label relative">
          <span>Main</span>
          <span v-show="isUnsavedChanges('content')" class="badge badge---warn absolute left-0 fade-in">Unsaved changes</span>
        </div>
        <textarea v-model="actuality.content" class="textarea h-full" :disabled="isEditDisabled" />
      </label>

      <label class="flex flex-col w-full h-full">
        <div class="textarea__label relative">
          <span>Lazy</span>
          <span v-show="isUnsavedChanges('lazyContent')" class="badge badge---warn absolute right-0 fade-in">Unsaved changes</span>
        </div>
        <textarea v-model="actuality.lazyContent" class="textarea h-full" :disabled="isEditDisabled" />
      </label>
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="inline-block rounded leading-normal shadow-sm bg-indigo-200 text-indigo-600 text-sm font-semibold">
        <p v-if="updatedAtText" class="px-4 py-1">{{ updatedAtText }}</p>
      </div>

      <Button text="Update" :loading="isUpdating" :disabled="isEditDisabled" @click="updateActuality" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone } from 'lodash'
import { parseError } from '@/helpers'

export default {
  name: 'Actuality',
  data () {
    return {
      actuality : {},
      isLoading : true,
      isUpdating: false,
    }
  },
  computed: {
    ...mapGetters('actuality', { inActuality: 'getActuality' }),

    updatedAtText () {
      const { updatedAt } = this.actuality

      return updatedAt && `Updated at ${updatedAt}`
    },
    isEditDisabled () {
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
        .catch(this.onFail)
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
        .catch(this.onFail)
        .finally(() => {
          this.isUpdating = false
        })
    },
    isUnsavedChanges (field) {
      if (this.isLoading) return false

      return this.actuality[field] !== this.inActuality[field]
    },
    onFail (error) {
      this.$store.commit('pushError', parseError(error))
    },
  },
}
</script>
