<template>
  <div class="badge fixed top-3 right-25 px-3 py-1 space-x-1">
    <span :class="['updown__online-indicator !h-2 !w-2', indicatorClass]" />
    <span :class="[indicatorTextClass]">{{ indicatorText }}</span>
  </div>
</template>

<script>
export default {
  name: 'b-socket-indicator',
  data: () => ({
    isSocketConnected: false,
  }),
  computed: {
    indicatorClass () {
      return this.isSocketConnected ? 'bg-green-400' : 'bg-red-400'
    },
    indicatorTextClass () {
      return this.isSocketConnected ? 'text-green-400' : 'text-red-400'
    },
    indicatorText () {
      return this.isSocketConnected ? 'online' : 'offline'
    },
  },
  mounted () {
    this.$socket.on('connect', () => {
      this.isSocketConnected = true
    })
    this.$socket.on('disconnect', () => {
      this.isSocketConnected = false
    })
  },
}
</script>
