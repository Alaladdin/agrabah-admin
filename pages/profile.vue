<template>
  <div class="flex justify-center items-center">
    <img
      class="m-x-7 rounded-full w-40 h-40 ring-8 ring-indigo-600 shadow-sm"
      :src="userData.avatarUrl"
      :alt="userData.username"
    >

    <h2 class="px-3 rounded bg-white font-semibold text-xl text-gray-800 text-center shadow-sm">
      {{ userData.username }}
    </h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name    : 'Profile',
  computed: {
    ...mapGetters({ userData: 'getUserData' }),
  },
}
</script>
