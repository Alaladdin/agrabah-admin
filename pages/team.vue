<template>
  <div>
    <div v-if="data" class="grid grid-cols-2 gap-4">
      <div
        v-for="user in data"
        :key="user._id"
        class="updown__item"
        :class="getUserItemClass(user)"
      >
        <div class="flex items-center">
          <b-avatar class="mr-5" :user="user" />
          <span v-if="!isEditingUser(user)" class="font-semibold text-xl">{{ user.username }}</span>
          <t-input v-else v-model="editingUserData.username" :variant="{ 'danger' : !isNewUsernameValid }" />
        </div>

        <div class="flex">
          <div v-if="!isEditingUser(user)" class="text-sm">{{ last(user.scope) }}</div>

          <template v-if="canEditUser(user)">
            <div v-if="!isEditingUser(user)" class="flex ml-3">
              <b-button class="px-2 mr-2" variant="indigo" before-icon="pencil-alt" @click="startUserEditing(user)" />
              <b-button class="px-2" variant="danger" :before-icon="['far', 'trash-alt']" @click="confirmRemoveUser(user)" />
            </div>

            <template v-else>
              <div class="flex text-sm mr-3">
                <t-checkbox label="user" checked disabled />
                <t-checkbox v-model="editingUserData.scope" value="admin" label="admin" />
              </div>

              <b-button class="px-2 mr-2" variant="indigo" before-icon="save" :disabled="!isNewUsernameValid" @click="editUserData" />
              <b-button class="px-2" variant="danger" before-icon="times" @click="stopUserEditing" />
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone, last } from 'lodash'
import { validateUsername } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'

export default {
  name      : 'team',
  components: {
    'b-avatar': BAvatar,
    'b-button': BButton,
  },
  mixins: [PageDefaultMixin('team')],
  data () {
    return {
      editingUserData: null,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),

    isNewUsernameValid () {
      return !!this.editingUserData && validateUsername(this.editingUserData.username)
    },
  },
  methods: {
    ...mapActions('team', ['editUser', 'removeUser']),

    last,
    getUserItemClass (user) {
      return {
        'ring-2 ring-purple-300': this.currentUser._id === user._id,
        'opacity-20'            : this.editingUserData && !this.isEditingUser(user),
      }
    },
    canEditUser (user) {
      const { _id, isOwner } = this.currentUser

      return isOwner && _id !== user._id
    },
    editUserData () {
      this.editUser(this.editingUserData)
        .then(this.stopUserEditing)
        .catch(this.$handleError)
    },
    startUserEditing (user) {
      this.editingUserData = clone(user)
    },
    stopUserEditing () {
      this.editingUserData = null
    },
    isEditingUser (user) {
      return this.editingUserData && this.editingUserData._id === user._id
    },
    confirmRemoveUser (user) {
      const isRemoveConfirmed = confirm(`Remove user "${user.username}"?`)

      if (isRemoveConfirmed)
        this.removeUser(user).catch(this.$handleError)
    },
  },
}
</script>
