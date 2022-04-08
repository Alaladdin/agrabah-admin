<template>
  <div class="relative animate-pulse">
    <div class="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-200" />

    <div class="rounded w-full bg-white">
      <div v-for="i in servicesCount" :key="i" class="options justify-between !w-full h-12.3">
        <div class="flex items-center w-full">
          <span class="rounded-full w-30 h-2.5 bg-gray-300" />
        </div>

        <div class="flex items-center space-x-5">
          <span class="rounded-full w-15 h-2.5 bg-gray-300" />
          <span class="rounded-full w-10 h-2.5 bg-gray-300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'b-metrics-page-loader',
  data: () => ({
    servicesCount: 15,
  }),
}
</script>
