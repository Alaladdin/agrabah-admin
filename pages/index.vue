<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="(service, index) in updownServices" :key="index" class="updown__item">
      <div class="font-semibold text-md text-gray-600">
        {{ service.title }}
        <span v-if="service.linkTitle">
          — <a class="text-blue-500" :href="service.url" target="_blank"> {{ service.linkTitle }}</a>
        </span>
      </div>

      <div class="flex justify-between items-center">
        <p :class="['mr-3', getTextOnlineClass(service.isOnline)]">
          {{ getIndicatorText(service.isOnline) }}
        </p>

        <span class="relative flex h-2.5 w-2.5">
          <span :class="['updown__online-indicator', getBgOnlineClass(service.isOnline)]" />
          <span v-if="service.isOnline" class="updown__online-pulse animate-ping bg-green-400" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name    : 'home',
  computed: {
    ...mapGetters('updown', { updownServices: 'getUpdownServices' }),
  },
  methods: {
    getIndicatorText (isOnline) {
      if (isOnline === null) return 'unknown'

      return isOnline ? 'online' : 'offline'
    },
    getBgOnlineClass (isOnline) {
      if (isOnline === null) return 'bg-gray-400'

      return (isOnline ? 'bg-green-400' : 'bg-red-400')
    },
    getTextOnlineClass (isOnline) {
      if (isOnline === null) return 'text-gray-400'

      return (isOnline ? 'text-green-400' : 'text-red-400')
    },
  },
}
</script>
