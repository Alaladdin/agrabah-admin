<template>
  <div class="flex w-full">
    <div class="flex justify-between mb-3 w-full max-h-120">
      <label class="flex flex-col mr-3 w-full h-full">
        <div class="actuality__textarea-label relative">
          <span>Main</span>
          <span v-show="isUnsavedChanges('content')" class="badge badge--warn absolute left-0 fade-in">Unsaved changes</span>
        </div>
        <t-textarea v-model="actuality.content" class="w-full h-full min-h-85 !resize-y" :disabled="isEditDisabled" :readonly="!user.isAdmin" />
      </label>

      <label class="flex flex-col w-full h-full">
        <div class="actuality__textarea-label relative">
          <span>Lazy</span>
          <span v-show="isUnsavedChanges('lazyContent')" class="badge badge--warn absolute right-0 fade-in">Unsaved changes</span>
        </div>
        <t-textarea v-model="actuality.lazyContent" class="w-full h-full min-h-85 !resize-y" :disabled="isEditDisabled" :readonly="!user.isAdmin" />
      </label>
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="flex font-semibold text-sm gap-2 text-indigo-600 leading-normal">
        <div class="rounded shadow-sm bg-indigo-200">
          <p v-if="updatedAtText" class="px-4 py-1">{{ updatedAtText }}</p>
        </div>

        <div v-if="user.isAdmin" class="rounded shadow-sm bg-indigo-200">
          <p v-if="actuality.shortId" class="px-4 py-1">ShortId: {{ actuality.shortId }}</p>
        </div>
      </div>

      <div class="flex">
        <t-button variant="white" text="Refresh" :disabled="isEditDisabled" @click="loadActualityData" />
        <t-button v-if="user.isAdmin" class="ml-2" text="Update" :disabled="isEditDisabled" @click="updateActuality" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone, isEmpty } from 'lodash'

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
  watch: {
    inActuality: {
      immediate: true,
      handler (v) {
        this.actuality = clone(v)
      },
    },
  },
  created () {
    if (isEmpty(this.inActuality))
      this.loadActualityData()
  },
  methods: {
    ...mapActions('actuality', ['loadActuality', 'setActuality']),

    loadActualityData () {
      this.isLoading = true

      this.loadActuality()
        .catch(this.$handleError)
        .finally(() => {
          this.isLoading = false
        })
    },
    updateActuality () {
      this.isUpdating = true

      this.setActuality(this.actuality)
        .catch(this.$handleError)
        .finally(() => {
          this.isUpdating = false
        })
    },
    isUnsavedChanges (field) {
      if (this.isLoading || !this.inActuality) return false

      return this.actuality[field] !== this.inActuality[field]
    },
  },
}
</script>
