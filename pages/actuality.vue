<template>
  <div class="flex w-full">
    <div class="flex justify-between mb-3 w-full">
      <v-md-editor
        v-model="data[currentActualityType]"
        class="w-full text-sm !resize-y bg-red-200"
        :class="{ 'disabled' : isEditDisabled }"
        :mode="user.isAdmin ? 'editable' : 'preview'"
        :toolbar="editorToolbar"
        left-toolbar="code bold link italic"
        right-toolbar="switchActualityType | preview sync-scroll fullscreen"
        placeholder="Urgent things"
        autofocus
        @keydown.native.enter.ctrl="onEnter"
      />
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="flex font-semibold text-sm space-x-2 text-indigo-600 leading-normal">
        <v-menu v-if="data.updatedAt" class="rounded shadow-sm bg-indigo-200" :disabled="!data.updatedBy">
          <p class="px-4 py-1">{{ updatedAtText }}</p>

          <template #popper>
            <b-user-info :user="data.updatedBy" />
          </template>
        </v-menu>

        <div class="rounded shadow-sm bg-indigo-200">
          <p class="px-4 py-1">Type: {{ currentActualityTypeText }}</p>
        </div>

        <div v-if="hasAnyChanges" class="badge badge--warn fade-in !text-sm">
          {{ unsavedChangesText }}
        </div>
      </div>

      <div class="flex space-x-2">
        <b-button v-if="!user.isAdmin" text="Switch type" variant="white" @click="changeCurrentActualityType" />
        <b-button text="Refresh" variant="white" :disabled="isEditDisabled" @click="refresh" />
        <b-button v-if="user.isAdmin" text="Update" :disabled="isUpdateDisabled" @click="updateActuality" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { assign, pick } from 'lodash'
import { formatDate, getFromLocalStorage, setToLocalStorage } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BUserInfo from '@/components/b-user-info'

const ACTUALITY_STORE_KEY = 'actuality__unsaved'

export default {
  name      : 'actuality',
  components: {
    'b-button'   : BButton,
    'b-user-info': BUserInfo,
  },
  mixins: [PageDefaultMixin('actuality')],
  data () {
    return {
      data                : {},
      currentActualityType: 'content',
      isUpdating          : false,
      clearDataOnDestroy  : false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    editorToolbar () {
      return {
        switchActualityType: {
          text  : 'switch type',
          title : 'Switch actuality type',
          action: this.changeCurrentActualityType,
        },
      }
    },
    currentActualityTypeText () {
      return this.currentActualityType === 'content' ? 'main' : 'lazy'
    },
    updatedAtText () {
      const updatedAt = formatDate(this.data.updatedAt, 'DD.MM HH:mm')

      return `Updated at ${updatedAt}`
    },
    unsavedChangesText () {
      const unsavedChangesText = 'Unsaved changes'
      const isContentUnsaved = this.hasUnsavedChanges('content')
      const isLazyContentUnsaved = this.hasUnsavedChanges('lazyContent')

      if (isContentUnsaved && isLazyContentUnsaved)
        return unsavedChangesText

      if (isContentUnsaved)
        return unsavedChangesText + ': main'

      return unsavedChangesText + ': lazy'
    },
    hasAnyChanges () {
      return this.hasUnsavedChanges('content') || this.hasUnsavedChanges('lazyContent')
    },
    isUpdateDisabled () {
      return !this.hasAnyChanges || this.isEditDisabled
    },
    isEditDisabled () {
      return this.isLoading || this.isUpdating
    },
  },
  watch: {
    'data.content' () {
      this.handleActualityChange()
    },
    'data.lazyContent' () {
      this.handleActualityChange()
    },
  },
  methods: {
    ...mapActions('actuality', ['updateData']),

    getPreparedData (data) {
      return assign({}, data, getFromLocalStorage(ACTUALITY_STORE_KEY))
    },
    onEnter () {
      if (!this.isUpdateDisabled && this.user.isAdmin)
        this.updateActuality()
    },
    updateActuality () {
      this.isUpdating = true

      this.updateData(this.data)
        .catch(this.$handleError)
        .finally(() => {
          this.isUpdating = false
        })
    },
    changeCurrentActualityType () {
      this.currentActualityType = this.currentActualityType === 'content' ? 'lazyContent' : 'content'
    },
    hasUnsavedChanges (field) {
      if (this.isLoading || !this.rawData)
        return false

      return this.data[field].trim() !== this.rawData[field].trim()
    },
    handleActualityChange () {
      if (!this.hasAnyChanges)
        return this.clearLocalActuality()

      setToLocalStorage(ACTUALITY_STORE_KEY, pick(this.data, ['content', 'lazyContent']))
    },
    clearAdditionalData () {
      this.clearLocalActuality()
    },
    clearLocalActuality () {
      setToLocalStorage(ACTUALITY_STORE_KEY, {})
    },
  },
}
</script>
