<template>
  <a
    class="badge fixed top-3 right-3 font-semibold"
    href="https://github.com/Alaladdin/agrabah-admin"
    target="_blank"
  >
    <fa class="mr-1" icon="code-branch" />
    <span>{{ appVersion }}</span>
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
