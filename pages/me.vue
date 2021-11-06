<template>
  <div class="flex justify-center items-center">
    <Avatar class="m-x-7" :user="user" size="extraLarge" />
    <div class="mb-10">
      <h2 v-if="!isEditing" class="badge font-semibold !text-lg cursor-pointer" @click="startEditing">
        {{ user.username }}
      </h2>

      <template v-if="isEditing">
        <t-input v-model="newUsername" maxlength="15" class="mb-2" :variant="{ 'danger' : !isNewUsernameValid }" placeholder="Username" />
        <div class="flex">
          <t-button class="mr-2 w-full" variant="indigo" :disabled="!isNewUsernameValid" text="Save" @click="saveNewUsername" />
          <t-button class="w-full" variant="danger" text="Cancel" @click="stopEditing" />
        </div>
      </template>
    </div>

    <div class="flex justify-center mb-5">
      <div class="bg-white rounded w-max text-sm shadow-sm">
        <p class="flex justify-between p-3 w-100 border-b-1 last:border-b-0">
          <span>Registered at</span>
          <span>{{ formatDate(user.createdAt) }}</span>
        </p>

        <p class="flex justify-between p-3 w-100 border-b-1 last:border-b-0">
          <span>Access level</span>
          <span>{{ user.scope.join(', ') }}</span>
        </p>
      </div>
    </div>

    <t-button variant="danger" @click="confirmRemoveProfile">Delete my profile</t-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { validateUsername } from '@/helpers'

export default {
  name: 'Me',
  data () {
    return {
      newUsername: '',
      isEditing  : false,
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
    confirmRemoveProfile () {
      const isRemoveConfirmed = confirm('Are u sure want to delete your profile?')

      if (isRemoveConfirmed) {
        this.removeUser(this.user)
          .then(() => this.$auth.logout())
          .catch(this.$handleError)
      }
    },
    formatDate (date) {
      return moment(date).format('DD.MM.YYYY')
    },
  },
}
</script>
