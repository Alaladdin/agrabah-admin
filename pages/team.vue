<template>
  <div class="grid grid-cols-2 gap-4">
    <template v-if="users">
      <div v-for="(user, index) in users" :key="index" class="updown__item">
        <div class="flex items-center">
          <img class="mr-5 rounded-full w-12 h-12 ring-4 ring-violet-300 object-cover shadow-xl" src="~/assets/img/avatar__default.jpg">
          <span class="font-semibold text-xl">{{ user.username }}</span>
        </div>

        <div class="text-sm">
          <p class="flex justify-between">
            <span class="mr-5">Access level</span>
            <span>{{ user.scope.join(', ') }}</span>
          </p>

          <p class="flex justify-between">
            <span class="mr-5">Since</span>
            <span>{{ formatDate(user.createdAt) }}</span>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { parseError } from '@/helpers'

export default {
  name    : 'Team',
  computed: {
    ...mapGetters('team', { users: 'getUsers' }),
  },
  mounted () {
    this.loadUsers()
      .catch(this.onFail)
  },
  beforeDestroy () {
    this.$store.commit('team/CLEAR_DATA')
  },
  methods: {
    ...mapActions('team', ['loadUsers']),

    formatDate (date) {
      return moment(date).format('DD.MM.YYYY')
    },
    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
