<template>
  <div class="grid grid-cols-2 gap-4">
    <template v-if="users">
      <div v-for="(user, index) in users" :key="index" class="updown__item">
        <div class="flex items-center">
          <img class="mr-5 rounded-full w-12 h-12 ring-4 ring-violet-300 object-cover shadow-xl" src="~/assets/img/avatar__default.jpg">
          <span class="font-semibold text-xl">{{ user.username }}</span>
        </div>

        <div class="flex">
          <div class="text-sm">{{ user.scope.join(', ') }}</div>

          <div v-if="canEditUser(user)" class="flex ml-5">
            <t-button class="px-2 mr-2" disabled>
              <fa icon="edit" />
            </t-button>
            <t-button class="px-2" variant="danger" @click="confirmRemoveUser(user)">
              <fa icon="times" />
            </t-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseError } from '@/helpers'

export default {
  name    : 'Team',
  computed: {
    ...mapGetters({
      currentUser: 'getUserData',
      users      : 'team/getUsers',
    }),

    isOwner () {
      return this.$auth.hasScope('owner')
    },
  },
  mounted () {
    this.loadUsers()
      .catch(this.onFail)
  },
  beforeDestroy () {
    this.$store.commit('team/CLEAR_DATA')
  },
  methods: {
    ...mapActions('team', ['loadUsers', 'removeUser']),

    canEditUser (user) {
      return this.isOwner && user._id !== this.currentUser._id
    },
    confirmRemoveUser (user) {
      const isConfirmed = confirm(`Remove ${user.username}?`)

      if (isConfirmed)
        this.removeUser(user)
    },
    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
