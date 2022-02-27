<template>
  <div class="flex justify-center items-center">
    <b-avatar class="m-x-7 cursor-pointer" :url="user.avatar" size="extraLarge" @click="selectAvatar" />
    <b-image-upload
      ref="imageUploader"
      v-model="newUserData.avatar"
      :folder-name="user.username"
      @input="saveNewData"
    />

    <div class="mb-5">
      <h2 v-if="!isEditing" class="badge !py-0 font-semibold !text-lg cursor-pointer" @click="setEditing(true)">
        {{ user.username }}
      </h2>

      <template v-if="isEditing">
        <t-input
          v-model="newUserData.username"
          class="mb-2"
          maxlength="15"
          placeholder="Username"
          :variant="{ 'danger' : !isNewUsernameValid }"
        />
        <div class="flex">
          <b-button class="mr-2 w-full" text="Save" variant="indigo" :disabled="!isNewUsernameValid" @click="saveNewData" />
          <b-button class="w-full" text="Cancel" variant="danger" @click="setEditing(false)" />
        </div>
      </template>
    </div>

    <div class="flex justify-center mb-5">
      <div class="bg-white rounded w-max shadow-sm">
        <p v-for="(field, index) in profileInfoFields" :key="index" class="options">
          <span>{{ field.title }}</span>
          <span class="options__item">{{ field.value }}</span>
        </p>
      </div>
    </div>

    <b-button variant="danger" @click="openModal('showConfirmActionModal')">Delete my profile</b-button>

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

export default {
  name      : 'me',
  components: {
    'b-avatar'              : BAvatar,
    'b-button'              : BButton,
    'b-image-upload'        : BImageUpload,
    'b-confirm-action-modal': BConfirmActionModal,
  },
  data () {
    return {
      newUserData: {
        username: '',
        avatar  : '',
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
    isNewUsernameValid () {
      return validateUsername(this.newUserData.username)
    },
  },
  watch: {
    isEditing () {
      this.newUserData.username = this.user.username
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
      this.setEditing(false)
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
