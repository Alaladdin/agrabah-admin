<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="(user, index) in teamUsers" :key="index" class="updown__item">
      <div class="flex items-center">
        <img class="mr-5 rounded-full ring-4 ring-violet-300 shadow-xl" :src="user.avatarURL || user.defaultAvatarURL" width="45" height="45">
        <span class="font-semibold text-xl">{{ user.username }}</span>
      </div>

      <div v-if="user.hexAccentColor" class="mr-2 rounded-full w-6 h-6" :style="`background-color: ${user.hexAccentColor}`" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseError } from '@/helpers'

export default {
  name    : 'Team',
  computed: {
    ...mapGetters('discord', { teamUsers: 'getTeamUsers' }),
  },
  methods: {
    onFail (error) {
      this.$store.commit('pushError', parseError(error))
    },
  },
}
</script>
