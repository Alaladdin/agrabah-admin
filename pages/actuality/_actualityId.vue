<template>
  <div class="flex w-full">
    <div class="flex justify-between mb-3 w-full">
      <v-md-editor
        v-model="data.data"
        class="w-full text-sm !resize-y bg-red-200"
        :class="{ 'disabled' : isEditDisabled }"
        :mode="user.isAdmin ? 'editable' : 'preview'"
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

        <div v-if="hasAnyChanges" class="badge badge--warn fade-in !text-sm">
          Unsaved changes
        </div>
      </div>

      <div class="flex space-x-2">
        <b-button text="Refresh" variant="white" :disabled="isEditDisabled" @click="refresh" />
        <b-button v-if="user.isAdmin" text="Update" :disabled="isUpdateDisabled" @click="updateActuality" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { assign } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BUserInfo from '@/components/b-user-info'
import { formatDate, getFromLocalStorage, setToLocalStorage } from '@/helpers'

export default {
  name      : 'actuality-id',
  components: {
    'b-button'   : BButton,
    'b-user-info': BUserInfo,
  },
  mixins: [PageDefaultMixin('actuality')],
  data  : () => ({
    data      : {},
    isUpdating: false,
  }),
  computed: {
    ...mapGetters({
      rawData: 'actuality/getActuality',
      user   : 'getUserData',
    }),

    actualityId () {
      return this.$route.params.actualityId
    },
    actualityStoreKey () {
      return 'actuality__unsaved__' + this.actualityId
    },
    updatedAtText () {
      const updatedAt = formatDate(this.data.updatedAt, 'DD.MM HH:mm')

      return `Updated at ${updatedAt}`
    },
    hasAnyChanges () {
      if (this.isLoading || !this.rawData)
        return false

      return this.data.data.trim() !== this.rawData.data.trim()
    },
    isUpdateDisabled () {
      return !this.hasAnyChanges || this.isEditDisabled
    },
    isEditDisabled () {
      return this.isLoading || this.isUpdating
    },
  },
  watch: {
    'data.data' () {
      this.handleActualityChange()
    },
  },
  methods: {
    ...mapActions('actuality', {
      init         : 'getActuality',
      editActuality: 'editActuality',
    }),

    getInitData () {
      return this.actualityId
    },
    getPreparedData (data) {
      return assign({}, data, getFromLocalStorage(this.actualityStoreKey))
    },
    afterInit (actuality) {
      this.$setPageTitle(actuality.name)
    },
    onEnter () {
      if (!this.isUpdateDisabled && this.user.isAdmin)
        this.updateActuality()
    },
    updateActuality () {
      this.isUpdating = true

      this.editActuality(this.data)
        .catch(this.$handleError)
        .finally(() => {
          this.isUpdating = false
        })
    },
    handleActualityChange () {
      if (!this.isLoading && !this.hasAnyChanges)
        return this.clearLocalActuality()

      setToLocalStorage(this.actualityStoreKey, this.data.data)
    },
    clearAdditionalData () {
      this.clearLocalActuality()
    },
    clearLocalActuality () {
      setToLocalStorage(this.actualityStoreKey, {})
    },
    clearData () {
      this.$store.commit('actuality/CLEAR_ACTUALITY')
    },
  },
}
</script>
