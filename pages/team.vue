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
          <b-avatar class="mr-5 cursor-pointer" :url="user.avatar" @click="goToUserProfile(user)" />
          <span class="font-semibold text-xl">{{ user.displayName || user.username }}</span>
        </div>

        <div class="flex">
          <div v-if="!isEditingUser(user)" class="text-sm">{{ last(user.scope) }}</div>

          <template v-if="canEditUser(user)">
            <div v-if="!isEditingUser(user)" class="flex ml-3 space-x-2">
              <b-button class="px-2" variant="indigo" before-icon="pencil" @click="startUserEditing(user)" />
              <b-button class="px-2" variant="danger" before-icon="trash-can" @click="openConfirmRemoveUserModal(user)" />
            </div>

            <template v-else>
              <div class="flex mr-3 space-x-3 text-sm">
                <b-checkbox checked disabled>user</b-checkbox>
                <b-checkbox v-model="editingUserData.scope" value="admin">admin</b-checkbox>
              </div>

              <b-button class="px-2 mr-2" variant="indigo" before-icon="floppy-disk" @click="editUserData" />
              <b-button class="px-2" variant="danger" before-icon="xmark" @click="stopUserEditing" />
            </template>
          </template>
        </div>
      </div>
    </div>

    <b-confirm-action-modal
      v-model="showConfirmActionModal"
      :title="confirmRemoveUserModalTitle"
      :on-confirm="removeUserProfile"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone, last } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'
import BConfirmActionModal from '@/components/b-confirm-action-modal'
import BCheckbox from '@/components/b-checkbox'

export default {
  name      : 'team',
  components: {
    'b-avatar'              : BAvatar,
    'b-button'              : BButton,
    'b-checkbox'            : BCheckbox,
    'b-confirm-action-modal': BConfirmActionModal,
  },
  mixins: [PageDefaultMixin('team')],
  data () {
    return {
      editingUserData       : null,
      removingUser          : null,
      showConfirmActionModal: false,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),

    confirmRemoveUserModalTitle () {
      if (!this.removingUser)
        return ''

      return `Remove user "${this.removingUser.username}"?`
    },
  },
  methods: {
    ...mapActions('team', ['editUser', 'removeUser']),

    last,
    getUserItemClass (user) {
      return {
        'ring-2 ring-purple-300': this.currentUser._id === user._id,
        'opacity-40'            : this.editingUserData && !this.isEditingUser(user),
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
    goToUserProfile (user) {
      const { username } = user

      this.$router.push({
        name  : 'user/username',
        params: { username },
      })
    },
    openConfirmRemoveUserModal (user) {
      this.removingUser = user
      this.openModal('showConfirmActionModal')
    },
    removeUserProfile () {
      this.removeUser(this.removingUser)
        .catch(this.$handleError)
        .finally(() => {
          this.removingUser = null
        })
    },
  },
}
</script>
