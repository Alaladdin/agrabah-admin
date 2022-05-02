<template>
  <div
    class="updown__item"
    :class="{ 'ring-2 ring-purple-300': currentUser._id === user._id }"
    @contextmenu.prevent="canEditUser && showContextMenu($event)"
  >
    <div class="flex items-center">
      <b-avatar class="mr-5 cursor-pointer" :user="user" @click="goToUserProfile" />
      <span class="font-semibold text-xl">{{ user.displayName || user.username }}</span>
    </div>

    <div class="flex">
      <div v-if="!editingUserData" class="text-sm">{{ last(user.scope) }}</div>

      <div v-if="editingUserData" class="flex mr-3 space-x-3 text-sm">
        <b-checkbox checked disabled>user</b-checkbox>
        <b-checkbox v-model="editingUserData.scope" value="admin">admin</b-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { last } from 'lodash'
import BCheckbox from '@/components/b-checkbox'
import BAvatar from '@/components/b-avatar'
import { clone } from '@/helpers'

export default {
  name      : 'b-team-item',
  components: {
    'b-checkbox': BCheckbox,
    'b-avatar'  : BAvatar,
  },
  props: {
    user: {
      type   : Object,
      default: () => ({}),
    },
  },
  data: () => ({
    editingUserData: null,
    isSaving       : false,
    isRemoving     : false,
  }),
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),

    canEditUser () {
      const { _id, isOwner } = this.currentUser

      return isOwner && _id !== this.user._id
    },
    contextMenuButtons () {
      const isButtonsDisabled = this.isSaving || this.isRemoving

      return this.editingUserData
        ? [{
            title   : 'Save',
            icon    : 'floppy-disk',
            disabled: isButtonsDisabled,
            callback: this.editUserData,
          },
          {
            title   : 'Cancel',
            icon    : 'xmark',
            callback: this.stopEditing,
          }]
        : [{
            title   : 'Edit',
            icon    : 'pencil',
            disabled: isButtonsDisabled,
            callback: this.startEditing,
          },
          {
            title   : 'Remove',
            icon    : 'trash-can',
            class   : '!text-red-500',
            disabled: isButtonsDisabled,
            callback: this.removeUserProfile,
          }]
    },
  },
  methods: {
    ...mapActions('team', ['editUser', 'removeUser']),
    ...mapMutations('context-menu', {
      commitSetContextMenuButtons   : 'SET_BUTTONS',
      commitSetContextMenuPosition  : 'SET_POSITION',
      commitSetContextMenuVisibility: 'SET_VISIBILITY',
    }),

    last,
    showContextMenu (e) {
      this.commitSetContextMenuButtons(this.contextMenuButtons)
      this.commitSetContextMenuPosition({ x: e.x, y: e.y })
      this.commitSetContextMenuVisibility(true)
    },
    editUserData () {
      this.isSaving = true

      this.editUser(this.editingUserData)
        .then(this.stopEditing)
        .catch(this.$handleError)
        .finally(() => {
          this.isSaving = false
        })
    },
    removeUserProfile () {
      this.isRemoving = true

      this.removeUser(this.user)
        .catch(this.$handleError)
        .finally(() => {
          this.isRemoving = false
        })
    },
    startEditing () {
      this.editingUserData = clone(this.user)
    },
    stopEditing () {
      this.editingUserData = null
    },
    goToUserProfile () {
      const { username } = this.user

      this.$router.push({ name: 'user/username', params: { username } })
    },
  },
}
</script>
