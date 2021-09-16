<template>
  <div class="flex bg-gray-200">
    <SideBar />

    <div class="flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <span class="mb-10 font-bold text-3xl text-gray-800 text-center">{{ pageTitle }}</span>
          <Nuxt class="flex flex-col" />
          <div class="fixed bottom-3 right-3 py-1 px-3 rounded shadow-sm bg-white text-gray-600 text-sm">
            v {{ appVersion }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { capitalize } from '@/helpers'

export default {
  name    : 'Default',
  computed: {
    ...mapGetters({ appVersion: 'getAppVersion' }),

    pageTitle () {
      if (this.$route.path !== '/' || !this.$auth.$state.user) return this.capitalize(this.$nuxt.$route.name)

      const { username } = this.$auth.$state.user

      return `Hi, ${username}`
    },
  },
  created () {
    this.loadAppVersion()
  },
  methods: {
    ...mapActions(['loadAppVersion']),

    capitalize,
  },
}
</script>
