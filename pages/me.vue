<template>
  <div class="flex justify-center items-center">
    <b-avatar class="m-x-7" :url="user.avatar" size="extraLarge" />

    <div v-if="isEditing" class="flex flex-col justify-center items-center space-y-10">
      <b-button text="Select avatar" @click="selectAvatar" />

      <div class="flex flex-col justify-start space-y-5">
        <b-input
          v-model="newUserData.username"
          label="Username"
          maxlength="15"
          :variant="{ 'danger' : !isNewUsernameValid }"
        />

        <b-input
          v-model="newUserData.displayName"
          label="Display name"
          maxlength="15"
          :variant="{ 'danger' : !isNewDisplayNameValid }"
        />
      </div>

      <div class="flex space-x-2">
        <b-button text="Save" variant="indigo" :disabled="isSaveDisabled" @click="saveNewData" />
        <b-button text="Cancel" variant="danger" @click="setEditing(false)" />
      </div>
    </div>

    <template v-if="!isEditing">
      <h2 class="badge !py-0 mb-5 font-semibold !text-lg">
        {{ user.username }}
      </h2>

      <div class="flex justify-center mb-5">
        <div class="bg-white rounded w-max shadow-sm">
          <p v-for="(field, index) in profileInfoFields" :key="index" class="options">
            <span>{{ field.title }}</span>
            <span class="options__item">{{ field.value }}</span>
          </p>
        </div>
      </div>

      <div class="flex space-x-2">
        <b-button variant="indigo" @click="setEditing(true)">Edit profile</b-button>
        <b-button variant="danger" @click="openModal('showConfirmActionModal')">Delete profile</b-button>
      </div>
    </template>

    <b-image-upload
      ref="imageUploader"
      v-model="newUserData.avatar"
      :folder-name="user.username"
      @file-selected="setEditing(false)"
      @input="saveNewData"
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
import { pickBy } from 'lodash'
import { formatDate, validateUsername } from '@/helpers'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'
import BConfirmActionModal from '@/components/b-confirm-action-modal'
import BImageUpload from '@/components/b-image-upload'
import BInput from '@/components/b-input'
import { validateDisplayName } from '@/helpers/validators'

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
      showConfirmActionModal: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    profileInfoFields () {
      const { lastLoggedAt, createdAt, scope } = this.user

      return [
        {
          title: 'Account age',
          value: moment().diff(createdAt, 'days') + ' days',
        },
        {
          title: 'Last logged at',
          value: formatDate(lastLoggedAt, 'HH:mm:ss DD.MM.YYYY'),
        },
        {
          title: 'Registered at',
          value: formatDate(createdAt),
        },
        {
          title: 'Access level',
          value: scope.join(', '),
        },
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
  watch: {
    isEditing () {
      this.newUserData.username = this.user.username
      this.newUserData.displayName = this.user.displayName
    },
  },
  methods: {
    ...mapActions({
      editUser  : 'editUser',
      removeUser: 'team/removeUser',
    }),

    saveNewData () {
      const data = {
        ...pickBy(this.newUserData, v => !!v),
        _id: this.user._id,
      }

      this.editUser(data)
        .then(() => this.setEditing(false))
        .catch(this.$handleError)
    },
    selectAvatar () {
      this.$refs.imageUploader.selectFile()
    },
    setEditing (isEditing) {
      this.isEditing = isEditing
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
