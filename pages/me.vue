<template>
  <div class="flex justify-center items-center">
    <b-avatar class="m-x-7" :url="newUserData.avatar || user.avatar" size="extraLarge" />

    <div v-if="isEditing" class="flex flex-col justify-center items-center space-y-10">
      <b-button text="Select avatar" @click="selectAvatar" />

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

    <b-image-upload
      ref="imageUploader"
      v-model="newUserData.avatar"
      :folder-name="user.username"
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
import { formatDate, validateUsername, validateDisplayName } from '@/helpers'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'
import BConfirmActionModal from '@/components/b-confirm-action-modal'
import BImageUpload from '@/components/b-image-upload'
import BInput from '@/components/b-input'

export default {
  name      : 'me',
  components: {
    'b-avatar'              : BAvatar,
    'b-input'               : BInput,
    'b-button'              : BButton,
    'b-image-upload'        : BImageUpload,
    'b-confirm-action-modal': BConfirmActionModal,
  },
  data () {
    return {
      newUserData: {
        username   : '',
        displayName: '',
        avatar     : '',
      },
      isEditing             : false,
      isSaving              : false,
      showConfirmActionModal: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    profileInfoFields () {
      const { lastLoggedAt, createdAt, scope } = this.user
      const accountAge = moment().diff(createdAt, 'days') + ' days'
      const lastLoggedDate = formatDate(lastLoggedAt, 'HH:mm:ss DD.MM.YYYY')

      return [
        { title: 'Account age', value: accountAge },
        { title: 'Last logged at', value: lastLoggedDate },
        { title: 'Registered at', value: formatDate(createdAt) },
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

    selectAvatar () {
      this.$refs.imageUploader.selectFile()
    },
    saveNewData () {
      const newUserData = { ...this.newUserData, _id: this.user._id }

      this.isSaving = true

      this.editUser(newUserData)
        .then(this.stopEditing)
        .catch(this.$handleError)
        .finally(() => {
          this.isSaving = false
        })
    },
    startEditing () {
      const { username, displayName, avatar } = this.user

      this.newUserData.username = username
      this.newUserData.displayName = displayName
      this.newUserData.avatar = avatar
      this.isEditing = true
    },
    stopEditing () {
      this.isEditing = false
    },
    removeProfile () {
      this.removeUser(this.user)
        .then(() => this.$auth.logout())
        .catch(this.$handleError)
    },
    openModal (field) {
      this[field] = true
    },
  },
}
</script>
