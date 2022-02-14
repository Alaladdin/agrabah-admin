<template>
  <a class="badge fixed top-3 right-3" href="https://github.com/Alaladdin/mpei-admin-nuxt" target="_blank">
    v {{ appVersion }}
  </a>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name    : 'b-app-version',
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
