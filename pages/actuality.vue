<template>
  <div class="flex w-full">
    <div class="flex justify-between mb-3 w-full h-85">
      <label class="flex flex-col mr-3 w-full h-full">
        <div class="actuality__textarea-label relative">
          <span>Main</span>
          <span v-show="isUnsavedChanges('content')" class="badge badge---warn absolute left-0 fade-in">Unsaved changes</span>
        </div>
        <t-textarea v-model="actuality.content" class="w-full h-full" :disabled="isEditDisabled" :readonly="!user.isAdmin" />
      </label>

      <label class="flex flex-col w-full h-full">
        <div class="actuality__textarea-label relative">
          <span>Lazy</span>
          <span v-show="isUnsavedChanges('lazyContent')" class="badge badge---warn absolute right-0 fade-in">Unsaved changes</span>
        </div>
        <t-textarea v-model="actuality.lazyContent" class="w-full h-full" :disabled="isEditDisabled" :readonly="!user.isAdmin" />
      </label>
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="inline-block rounded leading-normal shadow-sm bg-indigo-200 text-indigo-600 text-sm font-semibold">
        <p v-if="updatedAtText" class="px-4 py-1">{{ updatedAtText }}</p>
      </div>

      <div class="flex">
        <t-button variant="white" :disabled="isEditDisabled" @click="loadActualityData">
          <fa icon="sync-alt" />
        </t-button>

        <t-button v-if="user.isAdmin" class="ml-2" text="Update" :disabled="isEditDisabled" @click="updateActuality" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone, isEmpty } from 'lodash'
import { parseError } from '@/helpers'

export default {
  name: 'Actuality',
  data () {
    return {
      actuality : {},
      isLoading : false,
      isUpdating: false,
    }
  },
  computed: {
    ...mapGetters({
      user       : 'getUserData',
      inActuality: 'actuality/getActuality',
    }),

    updatedAtText () {
      const { updatedAt } = this.actuality

      return updatedAt && `Updated at ${updatedAt}`
    },
    isEditDisabled () {
      return this.isLoading || this.isUpdating
    },
  },
  created () {
    if (isEmpty(this.inActuality))
      this.loadActualityData()
    else
      this.applyActualityData()
  },
  methods: {
    ...mapActions('actuality', ['loadActuality', 'setActuality']),

    loadActualityData () {
      this.isLoading = true

      this.loadActuality()
        .then(this.applyActualityData)
        .catch(this.onFail)
        .finally(() => {
          this.isLoading = false
        })
    },
    applyActualityData () {
      this.actuality = clone(this.inActuality)
    },
    updateActuality () {
      this.isUpdating = true

      const { content, lazyContent } = this.actuality

      this.setActuality({ content, lazyContent })
        .then(this.loadActualityData)
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
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
