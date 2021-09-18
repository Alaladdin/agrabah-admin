<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="(item, index) in onlineData" :key="index" class="flex justify-between items-center p-3 rounded shadow-sm text-gray-600 bg-white">
      <div class="font-semibold text-md text-gray-600">
        {{ item.title }}
        <a v-if="item.linkTitle" :href="item.link" class="text-blue-500" target="_blank">{{ item.linkTitle }}</a>
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
export default {
  name: 'Home',
  data () {
    return {
      onlineData: [
        {
          title    : 'Website',
          link     : 'https://mpei.space',
          linkTitle: 'mpei.space',
          isOnline : null,
        },
        {
          title   : 'Agrabah server',
          link    : 'https://api.mpei.space',
          isOnline: null,
        },
        {
          title   : 'URL shortener',
          link    : 'https://woka.site',
          isOnline: null,
        },
        {
          title   : 'DIS Bot',
          isOnline: null,
        },
        {
          title   : 'VK Bot',
          isOnline: null,
        },
      ],
    }
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
