<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="(item, index) in updownServices" :key="index" class="flex justify-between items-center p-3 rounded shadow-sm text-gray-600 bg-white">
      <div class="font-semibold text-md text-gray-600">
        {{ item.title }}
        <span v-if="item.linkTitle">
          — <a class="text-blue-500" :href="item.url" target="_blank"> {{ item.linkTitle }}</a>
        </span>
      </div>

      <div class="flex justify-between items-center">
        <span :class="['mr-3', getOnlineTextClass(item.isOnline)]">{{ getOnlineText(item.isOnline) }}</span>

        <span class="relative flex h-2.5 w-2.5">
          <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', item.isOnline !== null ? getOnlineBgClass(item.isOnline) : '']" />
          <span :class="[ 'relative inline-flex rounded-full h-2.5 w-2.5', getOnlineBgClass(item.isOnline)]" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name    : 'Home',
  computed: {
    ...mapGetters('updown', { updownServices: 'getUpdownServices' }),
  },
  methods: {
    getOnlineText (isOnline) {
      if (isOnline === null) return 'unknown'

      return isOnline ? 'online' : 'offline'
    },
    getOnlineTextClass (isOnline) {
      if (isOnline === null) return 'text-gray-400'

      return isOnline ? 'text-green-400' : 'text-red-400'
    },
    getOnlineBgClass (isOnline) {
      if (isOnline === null) return 'bg-gray-400'

      return isOnline ? 'bg-green-400' : 'bg-red-400'
    },
  },
}
</script>
