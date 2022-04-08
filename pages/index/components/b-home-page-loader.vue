<template>
  <div class="relative animate-pulse">
    <div class="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-200" />

    <div class="grid grid-cols-2 gap-4">
      <div v-for="i in servicesCount" :key="i" class="updown__item justify-between h-12" :class="{ '!shadow-none' : servicesCount - 2 < i }">
        <div class="flex items-center w-full">
          <span class="rounded-full w-50 h-2.5 bg-gray-300" />
        </div>

        <div class="flex items-center space-x-3">
          <span class="rounded-full w-10 h-2.5 bg-gray-300" />
          <span class="rounded-full w-2.5 h-2.5 bg-gray-300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'b-home-page-loader',
  data: () => ({
    servicesCount: 12,
  }),
}
</script>
