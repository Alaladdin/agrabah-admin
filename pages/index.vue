<template>
  <div>
    <div v-for="(item, index) in onlineData" :key="index" class="flex justify-between items-center p-3 mb-3 rounded shadow-sm text-gray-600 bg-white">
      <div class="font-semibold text-md text-gray-600">
        {{ item.title }}
        <a v-if="item.link" :href="item.link" class="text-blue-500">{{ item.linkTitle }}</a>
      </div>

      <div class="flex justify-between items-center">
        <span :class="['mr-3', item.isOnline ? 'text-green-400' : 'text-red-400']">{{ item.isOnline ? 'online' : 'offline' }}</span>

        <span class="relative flex h-2.5 w-2.5">
          <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', item.isOnline ? 'bg-green-400' : 'bg-red-400']" />
          <span :class="['relative inline-flex rounded-full h-2.5 w-2.5', item.isOnline ? 'bg-green-400' : 'bg-red-400']" />
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
          isOnline : false,
        },
        {
          title   : 'Agrabah server',
          isOnline: true,
        },
        {
          title   : 'URL shortener',
          isOnline: true,
        },
        {
          title   : 'DIS Bot',
          isOnline: false,
        },
        {
          title   : 'VK Bot',
          isOnline: false,
        },
      ],
    }
  },
}
</script>
