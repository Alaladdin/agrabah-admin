<template>
  <a class="badge fixed bottom-3 right-3" href="https://github.com/Alaladdin/mpei-admin-nuxt" target="_blank">
    v {{ appVersion }}
  </a>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name    : 'AppVersion',
  computed: {
    ...mapGetters({ appVersion: 'getAppVersion' }),
  },
  created () {
    this.loadAppVersion()
  },
  methods: {
    ...mapActions(['loadAppVersion']),
  },
}
</script>
