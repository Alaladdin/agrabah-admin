<template>
  <div>
    <t-input
      v-model="searchUsername"
      class="mb-5 py-2 text-lg"
      placeholder="Find user by username"
      maxlength="15"
      :variant="{ 'danger' : !isSearchValid }"
    />
    <t-alert v-if="!!searchUsername && !users.length" variant="warn" show :dismissible="false">No users found</t-alert>

    <div v-if="users" class="grid grid-cols-2 gap-4">
      <div v-for="(user, index) in users" :key="index" class="updown__item" :class="getUserItemClass(user)">
        <div class="flex items-center">
          <img class="mr-5 rounded-full w-12 h-12 ring-4 ring-violet-300 object-cover shadow-xl" src="~/assets/img/avatar__default.jpg">
          <span v-if="!isEditingUser(user)" class="font-semibold text-xl">{{ user.username }}</span>
          <t-input v-else v-model="editingUserData.username" :variant="{ 'danger' : !isNewUsernameValid }" />
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

            <template v-else>
              <div class="flex text-sm mr-3">
                <t-checkbox label="user" checked disabled />
                <t-checkbox v-model="editingUserData.scope" value="admin" label="admin" />
              </div>
              <t-button class="px-2 mr-2" variant="indigo" :disabled="!isNewUsernameValid" @click="editUserData">
                <fa icon="save" />
              </t-button>
              <t-button class="px-2" variant="danger" @click="stopUserEditing">
                <fa icon="times" />
              </t-button>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone, debounce } from 'lodash'
import { isUsernameValid, generateSmallId } from '@/helpers'

export default {
  name: 'Team',
  data () {
    return {
      searchUsername : '',
      editingUserData: null,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'getUserData',
      users      : 'team/getUsers',
    }),

    queryData () {
      const filters = { username: this.searchUsername || null }

      return { filters, requestId: generateSmallId() }
    },
    isNewUsernameValid () {
      return isUsernameValid(this.editingUserData.username)
    },
    isSearchValid () {
      return this.searchUsername.length === 0 || isUsernameValid(this.searchUsername)
    },
  },
  watch: {
    searchUsername () {
      if (this.isSearchValid) this.loadUsersDebounced(this.queryData)
    },
  },
  created () {
    this.loadUsers(this.queryData)
      .then((users) => {
        this.$store.commit('SET_SIDEBAR_NOTIFICATION', { key: 'team', value: users.length })
      })
      .catch(this.$handleError)
  },
  beforeDestroy () {
    this.$store.commit('team/CLEAR_DATA')
  },
  methods: {
    ...mapActions('team', ['loadUsers', 'editUser', 'removeUser']),

    loadUsersDebounced: debounce(function (searchFilters) {
      this.loadUsers(searchFilters)
        .then(this.stopUserEditing)
        .catch(this.$handleError)
    }, 700),
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
    enableUserEditing (user) {
      this.editingUserData = clone(user)
    },
    editUserData () {
      this.editUser(this.editingUserData)
        .then(this.stopUserEditing)
        .catch(this.$handleError)
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
