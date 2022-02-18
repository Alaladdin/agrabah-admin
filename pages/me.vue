<template>
  <div class="flex justify-center items-center">
    <b-avatar class="m-x-7" :user="user" size="extraLarge" />
    <div class="mb-5">
      <h2 v-if="!isEditing" class="badge !py-0 font-semibold !text-lg cursor-pointer" @click="startEditing">
        {{ user.username }}
      </h2>

      <template v-if="isEditing">
        <t-input v-model="newUsername" maxlength="15" class="mb-2" :variant="{ 'danger' : !isNewUsernameValid }" placeholder="Username" />
        <div class="flex">
          <b-button class="mr-2 w-full" text="Save" variant="indigo" :disabled="!isNewUsernameValid" @click="saveNewUsername" />
          <b-button class="w-full" text="Cancel" variant="danger" @click="stopEditing" />
        </div>
      </template>
    </div>

    <div class="flex justify-center mb-5">
      <div class="bg-white rounded w-max shadow-sm">
        <p v-for="(field, index) in getProfileInfoFields()" :key="index" class="options">
          <span>{{ field.title }}</span>
          <span class="options__item">{{ field.value }}</span>
        </p>
      </div>
    </div>

    <div class="flex gap-3">
      <b-button variant="indigo" disabled @click="changePassword">Change password</b-button>
      <b-button variant="danger" @click="openModal('showConfirmActionModal')">Delete my profile</b-button>
    </div>

    <b-confirm-action-modal
      v-model="showConfirmActionModal"
      title="Are u sure want to delete your profile?"
      :on-confirm="confirmRemoveProfile"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { formatDate, validateUsername } from '@/helpers'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'
import BConfirmActionModal from '@/components/b-confirm-action-modal'

export default {
  name      : 'me',
  components: {
    'b-avatar'              : BAvatar,
    'b-button'              : BButton,
    'b-confirm-action-modal': BConfirmActionModal,
  },
  data () {
    return {
      newUsername           : '',
      isEditing             : false,
      showConfirmActionModal: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    isNewUsernameValid () {
      return validateUsername(this.newUsername)
    },
  },
  watch: {
    'user.username': {
      immediate: true,
      handler (v) {
        this.newUsername = v
      },
    },
  },
  methods: {
    ...mapActions({
      editUser  : 'editUser',
      removeUser: 'team/removeUser',
    }),

    getProfileInfoFields () {
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
    saveNewUsername () {
      const data = {
        _id     : this.user._id,
        username: this.newUsername,
      }

      this.editUser(data)
        .then(this.stopEditing)
        .catch(this.$handleError)
    },
    startEditing () {
      this.isEditing = true
    },
    stopEditing () {
      this.isEditing = false
      this.newUsername = this.user.username
    },
    changePassword () {},
    confirmRemoveProfile () {
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
