<template>
  <div
    class="updown__item"
    :class="{ 'ring-2 ring-purple-300': currentUser._id === user._id }"
    @contextmenu.prevent="canEditUser && showContextMenu($event)"
  >
    <b-user-info :user="user" />

    <div class="flex">
      <div v-if="!editingUserData && activityInfo" class="mr-2 text-purple-400 text-sm">{{ activityInfo }}</div>

      <div v-if="editingUserData" class="flex mr-3 space-x-3 text-sm">
        <b-checkbox checked disabled>user</b-checkbox>
        <b-checkbox v-model="editingUserData.scope" value="admin">admin</b-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BCheckbox from '@/components/b-checkbox'
import { clone } from '@/helpers'
import BUserInfo from '@/components/b-user-info'

export default {
  name      : 'b-team-item',
  components: {
    'b-user-info': BUserInfo,
    'b-checkbox' : BCheckbox,
  },
  props: {
    user: {
      type   : Object,
      default: () => ({}),
    },
    activityInfo: {
      type   : String,
      default: null,
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
            icon    : ['far', 'trash-can'],
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
  },
}
</script>

<style lang='scss'>
.team .b-avatar__status--online {
  @apply border-white;
}
</style>
