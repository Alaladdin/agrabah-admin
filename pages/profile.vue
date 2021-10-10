<template>
  <div class="flex justify-center items-center">
    <img
      class="m-x-7 rounded-full w-40 h-40 ring-8 ring-indigo-600 shadow-sm object-cover"
      src="~assets/img/avatar__default.jpg"
      :alt="user.username"
    >

    <h2 class="px-3 mb-10 rounded bg-white font-semibold text-xl text-gray-800 text-center shadow-sm">
      {{ user.username }}
    </h2>

    <div class="flex justify-center">
      <div class="bg-white rounded w-max text-sm shadow-sm">
        <p class="flex justify-between p-3 w-100 border-b-1 last:border-b-0">
          <span>Registered at</span>
          <span>{{ formatDate(user.createdAt) }}</span>
        </p>

        <p class="flex justify-between p-3 w-100 border-b-1 last:border-b-0">
          <span>Access level</span>
          <span>{{ user.accessLevel }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name    : 'Profile',
  computed: {
    ...mapGetters({ user: 'getUserData' }),
  },
  methods: {
    formatDate (date) {
      return moment(date).format('DD.MM.YYYY')
    },
  },
}
</script>
