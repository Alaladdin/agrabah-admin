<template>
  <div class="flex w-full">
    <div class="mb-4">
      <b-button
        text="back"
        before-icon="left-long"
        variant="white"
        @click="$router.push('/actuality')"
      />
    </div>

    <div class="flex justify-between mb-3 w-full">
      <b-markdown-editor
        v-model="data.data"
        placeholder="Some cool words"
        :old-value="rawData?.data"
        :editable="!!currentUser?.isAdmin"
        :disabled="isEditDisabled"
        @keydown.native.enter.ctrl="onEnter"
        @input="onActualityChange"
      />
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="flex font-semibold text-sm space-x-2 text-indigo-600 leading-normal">
        <v-menu v-if="data?.updatedAt" class="rounded shadow-sm bg-indigo-200" :disabled="!data.updatedBy">
          <p class="px-4 py-1">{{ updatedAtText }}</p>

          <template #popper>
            <b-user-info :user="data.updatedBy" />
          </template>
        </v-menu>

        <div v-if="changedText" class="badge badge--warn fade-in !text-sm">
          {{ changedText }}
        </div>
      </div>

      <div class="flex space-x-2">
        <b-button
          text="Refresh"
          variant="white"
          :disabled="isEditDisabled"
          @click="refresh"
        />

        <client-only>
          <b-button
            v-if="currentUser?.isAdmin"
            text="Update"
            :disabled="isUpdateDisabled"
            @click="updateActuality"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { assign, find, pick } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BUserInfo from '@/components/b-user-info'
import { formatDate, getFromLocalStorage, setToLocalStorage } from '@/helpers'
import BMarkdownEditor from '@/components/b-markdown-editor'

export default {
  name      : 'actuality-id',
  components: {
    'b-button'         : BButton,
    'b-user-info'      : BUserInfo,
    'b-markdown-editor': BMarkdownEditor,
  },
  mixins: [PageDefaultMixin('actuality')],
  data  : () => ({
    data      : {},
    isUpdating: false,
  }),
  computed: {
    ...mapGetters({
      rawData    : 'actuality/getActuality',
      currentUser: 'getUserData',
      onlineUsers: 'getOnlineUsers',
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
    changedText () {
      const { displayName, username } = this.userEditing || {}

      if (displayName || username)
        return `Editing now by ${displayName || username}`

      return (this.hasAnyChanges) ? 'Unsaved changes' : ''
    },
    userEditing () {
      const userEditing = find(this.onlineUsers, { activity: { action: 'editing', pageId: this.actualityId } })

      return (userEditing?._id === this.currentUser._id) ? null : userEditing
    },
    isUpdateDisabled () {
      return !this.hasAnyChanges || this.isEditDisabled
    },
    isEditDisabled () {
      return this.isLoading || this.isUpdating || !!this.userEditing
    },
  },
  watch: {
    'data.data' () {
      this.handleActualityChange()
    },
  },
  beforeDestroy () {
    if (!this.currentUser.loggedIn) return

    this.$socket.emit('user-activity', null)
    this.$socket.off('actuality-editing')
  },
  methods: {
    ...mapActions('actuality', {
      init         : 'getActuality',
      editActuality: 'editActuality',
    }),

    getInitData () {
      return this.actualityId
    },
    getPreparedData (actuality) {
      return assign({}, actuality, getFromLocalStorage(this.actualityStoreKey))
    },
    afterInit (actuality) {
      this.$setPageTitle(actuality.name)
    },
    onEnter () {
      if (!this.isUpdateDisabled && this.currentUser.isAdmin)
        this.updateActuality()
    },
    updateActuality () {
      this.isUpdating = true

      this.editActuality(this.data)
        .catch(this.$handleError)
        .then(() => {
          this.setLocalActuality()
        })
        .finally(() => {
          this.isUpdating = false
        })
    },
    refresh () {
      this.$socket.emit('actuality-editing', pick(this.rawData, ['_id', 'data']))
      this.setLocalActuality()
      this.clearData()
    },
    onActualityChange () {
      if (this.$socket.connected && !this.userEditing) {
        this.$socket.emit('actuality-editing', pick(this.data, ['_id', 'data']))
        this.$socket.emit('user-activity', {
          pageTitle: this.data.name,
          pageId   : this.data._id,
          action   : 'editing',
        })
      }
    },
    handleActualityChange () {
      const newLocalActuality = !this.isLoading && !this.hasAnyChanges ? {} : { data: this.data.data }

      this.setLocalActuality(newLocalActuality)

      this.$socket.on('actuality-editing', (e) => {
        const { actuality } = e

        if (!this.userEditing && actuality._id === this.actualityId)
          this.data.data = actuality.data ?? ''
      })
    },
    setLocalActuality (localActuality = {}) {
      setToLocalStorage(this.actualityStoreKey, localActuality)
    },
    clearData () {
      this.$store.commit('actuality/CLEAR_ACTUALITY')
    },
  },
}
</script>
