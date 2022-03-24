<template>
  <div class="flex justify-center items-center">
    <b-avatar class="m-x-7" :url="newUserData.avatar || user.avatar" size="extraLarge" />

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
        {{ user.username }}
      </h2>

      <div class="mb-5 rounded shadow-sm bg-white">
        <p v-for="(field, index) in profileInfoFields" :key="index" class="options">
          <span>{{ field.title }}</span>
          <span class="options__item">{{ field.value }}</span>
        </p>
      </div>

      <div class="flex space-x-2">
        <b-button variant="indigo" :disabled="isSaving" @click="startEditing">Edit profile</b-button>
        <b-button variant="danger" :disabled="isSaving" @click="openModal('showConfirmActionModal')">Delete profile</b-button>
      </div>
    </template>

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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { assign, pick } from 'lodash/object'
import { formatDate, validateUsername, validateDisplayName } from '@/helpers'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'
import BConfirmActionModal from '@/components/b-confirm-action-modal'

export default {
  name      : 'me',
  components: {
    'b-avatar'              : BAvatar,
    'b-button'              : BButton,
    'b-confirm-action-modal': BConfirmActionModal,
    'b-input'               : () => import('@/components/b-input'),
    'b-select-avatar-modal' : () => import('@/components/b-select-avatar-modal'),
  },
  data: () => ({
    newUserData                 : {},
    isEditing                   : false,
    isSaving                    : false,
    showSelectDefaultAvatarModal: false,
    showConfirmActionModal      : false,
  }),
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    profileInfoFields () {
      const { lastLoggedAt, createdAt, scope } = this.user
      const accountAge = moment().diff(createdAt, 'days') + ' days'
      const lastLoggedDate = formatDate(lastLoggedAt, 'HH:mm:ss DD.MM.YYYY')

      return [
        { title: 'Account age', value: accountAge },
        { title: 'Last logged at', value: lastLoggedDate },
        { title: 'Access level', value: scope.join(', ') },
      ]
    },
    isSaveDisabled () {
      return !this.isNewUsernameValid || !this.isNewDisplayNameValid
    },
    isNewUsernameValid () {
      return validateUsername(this.newUserData.username)
    },
    isNewDisplayNameValid () {
      return validateDisplayName(this.newUserData.displayName)
    },
  },
  methods: {
    ...mapActions({
      editUser  : 'editUser',
      removeUser: 'team/removeUser',
    }),

    saveNewData () {
      this.isSaving = true

      const newUserData = assign({ _id: this.user._id }, this.newUserData)

      this.editUser(newUserData)
        .then(this.stopEditing)
        .catch(this.$handleError)
        .finally(() => {
          this.isSaving = false
        })
    },
    stopEditing () {
      this.newUserData = {}
      this.isEditing = false
    },
    startEditing () {
      this.newUserData = pick(this.user, ['username', 'displayName', 'avatar'])
      this.isEditing = true
    },
    removeProfile () {
      this.removeUser(this.user)
        .then(() => this.$auth.logout())
        .catch(this.$handleError)
    },
    openModal (field) {
      this[field] = true
    },
    closeModal (field) {
      this[field] = false
    },
  },
}
</script>
