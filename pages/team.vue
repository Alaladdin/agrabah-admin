<template>
  <div class="grid grid-cols-2 gap-4">
    <template v-if="users">
      <div v-for="(user, index) in users" :key="index" class="updown__item" :class="{ 'opacity-20' : editingUserData && !isEditingUser(user) }">
        <div class="flex items-center">
          <img class="mr-5 rounded-full w-12 h-12 ring-4 ring-violet-300 object-cover shadow-xl" src="~/assets/img/avatar__default.jpg">
          <span class="font-semibold text-xl">{{ user.username }}</span>
        </div>

        <div class="flex">
          <div v-if="!isEditingUser(user)" class="text-sm">{{ user.scope.join(', ') }}</div>

          <template v-if="canEditUser(user)">
            <div v-if="!isEditingUser(user)" class="flex ml-3">
              <t-button class="px-2 mr-2" variant="indigo" @click="enableUserEditing(user)">
                <fa icon="pencil-alt" />
              </t-button>
              <t-button class="px-2" variant="danger" @click="confirmRemoveUser(user)">
                <fa :icon="['far', 'trash-alt']" />
              </t-button>
            </div>

            <template v-if="isEditingUser(user)">
              <div class="flex text-sm mr-3">
                <t-checkbox label="user" checked disabled />
                <t-checkbox v-model="editingUserData.scope" value="admin" label="admin" />
              </div>
              <t-button class="px-2 mr-2" variant="indigo" @click="editUserData">
                <fa icon="save" />
              </t-button>
              <t-button class="px-2" variant="danger" @click="stopUserEditing">
                <fa icon="times" />
              </t-button>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone } from 'lodash'
import { parseError } from '@/helpers'

export default {
  name: 'Team',
  data () {
    return {
      editingUserData: null,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'getUserData',
      users      : 'team/getUsers',
    }),
  },
  mounted () {
    this.loadUsers()
      .catch(this.onFail)
  },
  beforeDestroy () {
    this.$store.commit('team/CLEAR_DATA')
  },
  methods: {
    ...mapActions('team', ['loadUsers', 'editUser', 'removeUser']),

    canEditUser (user) {
      const { _id, isOwner } = this.currentUser

      return isOwner && _id !== user._id
    },
    enableUserEditing (user) {
      this.editingUserData = clone(user)
    },
    editUserData () {
      this.editUser(this.editingUserData)
        .then(this.stopUserEditing)
        .catch(this.onFail)
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
        this.removeUser(user).catch(this.onFail)
    },
    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
