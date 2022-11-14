<template>
  <div class="user-page flex justify-center items-center">
    <b-user-page-loader v-if="isLoading" />

    <template v-if="!isLoading">
      <b-alert v-if="!actualUser" text="No user found" variant="danger" />

      <template v-if="actualUser">
        <b-avatar class="m-x-7" :user="newUserData.avatar ? newUserData : actualUser" size="extraLarge" />

        <div v-if="isEditing" class="flex flex-col justify-center items-center space-y-5">
          <b-button text="Edit avatar" variant="white" @click="openModal('showSelectDefaultAvatarModal')" />

          <div class="flex flex-col justify-start space-y-5">
            <b-input
              v-model="newUserData.username"
              :variant="{ 'danger' : !isNewUsernameValid }"
              label="Username"
              maxlength="15"
            />

            <b-input
              v-model="newUserData.displayName"
              :variant="{ 'danger' : !isNewDisplayNameValid }"
              label="Display name"
              maxlength="15"
            />
          </div>

          <div class="flex space-x-2">
            <b-button text="Save" variant="indigo" :disabled="isSaveDisabled" @click="saveNewData" />
            <b-button text="Cancel" variant="danger" @click="stopEditing" />
          </div>
        </div>

        <template v-if="!isEditing">
          <h2 class="badge !py-0 mb-5 font-semibold !text-lg">
            {{ actualUser.username }}
          </h2>

          <div class="mb-5 rounded shadow-sm bg-white">
            <p v-for="(field, index) in profileInfoFields" :key="index" class="options">
              <span>{{ field.title }}</span>
              <span class="options__item">{{ field.value }}</span>
            </p>
          </div>

          <div v-if="isCurrentUser" class="flex space-x-2">
            <b-button variant="indigo" :disabled="isSaving" @click="startEditing">Edit profile</b-button>
            <b-button variant="danger" :disabled="isSaving" @click="openModal('showConfirmActionModal')">Delete profile</b-button>
          </div>
        </template>

        <template v-if="isCurrentUser">
          <b-select-avatar-modal
            v-if="isEditing"
            v-model="newUserData.avatar"
            :show="showSelectDefaultAvatarModal"
            :new-user-data="newUserData"
            @closed="closeModal('showSelectDefaultAvatarModal')"
          />

          <b-confirm-action-modal
            v-model="showConfirmActionModal"
            title="Are u sure want to delete your profile?"
            :on-confirm="removeProfile"
          />
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { assign, pick } from 'lodash/object'
import BUserPageLoader from './components/b-user-page-loader'
import { validateUsername, validateDisplayName } from '@/helpers'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'
import BConfirmActionModal from '@/components/b-confirm-action-modal'
import BAlert from '@/components/b-alert'

export default {
  name      : 'user',
  components: {
    'b-avatar'              : BAvatar,
    'b-alert'               : BAlert,
    'b-button'              : BButton,
    'b-user-page-loader'    : BUserPageLoader,
    'b-confirm-action-modal': BConfirmActionModal,
    'b-input'               : () => import('@/components/b-input'),
    'b-select-avatar-modal' : () => import('@/components/b-select-avatar-modal'),
  },
  data: () => ({
    newUserData                 : {},
    isEditing                   : false,
    isSaving                    : false,
    isLoading                   : false,
    showSelectDefaultAvatarModal: false,
    showConfirmActionModal      : false,
  }),
  computed: {
    ...mapGetters({
      user       : 'user/getUser',
      currentUser: 'getUserData',
    }),

    profileInfoFields () {
      console.log(this.context, this)

      const { lastLoggedAt, lastOnline, createdAt, scope } = this.actualUser
      const accountAge = moment().diff(createdAt, 'days') + ' days'
      const lastLoggedDate = moment(lastLoggedAt).fromNow()
      const lastOnlineDate = moment(lastOnline).fromNow()

      return [
        { title: 'Account age', value: accountAge },
        { title: 'Last logged at', value: lastLoggedDate },
        { title: 'Last online', value: lastOnlineDate },
        { title: 'Access level', value: scope.join(', ') },
      ]
    },
    actualUser () {
      return this.isCurrentUser ? this.currentUser : this.user
    },
    isCurrentUser () {
      return this.currentUser.username === this.username
    },
    username () {
      return this.$route.params.username
    },
    isSaveDisabled () {
      return !this.isNewUsernameValid || !this.isNewDisplayNameValid
    },
    isNewUsernameValid () {
      const { username } = this.newUserData

      return !!username && validateUsername(username)
    },
    isNewDisplayNameValid () {
      const { displayName } = this.newUserData

      return displayName !== undefined && validateDisplayName(displayName)
    },
  },
  watch: {
    username: {
      immediate: true,
      handler (username) {
        this.handleRouteUsernameChange(username)
      },
    },
  },
  beforeDestroy () {
    this.clearData()
  },
  methods: {
    ...mapActions({
      loadUser  : 'user/loadUser',
      editUser  : 'editUser',
      removeUser: 'user/removeUser',
    }),

    handleRouteUsernameChange (username) {
      if (!username)
        this.goToCurrentUserPage()
      else if (!this.isCurrentUser)
        this.loadUserData()
    },
    goToCurrentUserPage () {
      const { username } = this.currentUser
      const routeOptions = { name: 'user/username', params: { username } }

      this.$router.push(routeOptions)
    },
    loadUserData () {
      this.isLoading = true

      this.loadUser(this.username)
        .catch(this.$handleError)
        .finally(() => {
          this.isLoading = false
        })
    },
    saveNewData () {
      this.isSaving = true

      const newUserData = assign({ _id: this.currentUser._id }, this.newUserData)

      this.editUser(newUserData)
        .then(this.afterNewDataSaved)
        .catch(this.$handleError)
        .finally(() => {
          this.isSaving = false
        })
    },
    afterNewDataSaved (newUser) {
      this.$router.replace({ name: 'user/username', params: { username: newUser.username } })
        .catch(() => {})

      this.stopEditing()
    },
    stopEditing () {
      this.newUserData = {}
      this.isEditing = false
    },
    startEditing () {
      this.newUserData = pick(this.currentUser, ['username', 'displayName', 'avatar'])
      this.isEditing = true
    },
    removeProfile () {
      this.removeUser(this.currentUser)
        .then(() => this.$auth.logout())
        .catch(this.$handleError)
    },
    openModal (field) {
      this[field] = true
    },
    closeModal (field) {
      this[field] = false
    },
    clearData () {
      this.$store.commit('user/CLEAR_DATA')
    },
  },
}
</script>
