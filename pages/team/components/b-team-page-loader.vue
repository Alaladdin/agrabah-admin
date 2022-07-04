<template>
  <div class="relative">
    <div class="absolute w-full h-full z-1 bg-gradient-to-b from-transparent to-gray-200" />
    <div class="py-3.5 ml-auto mb-4 rounded w-20 bg-white animate-pulse" />

    <div class="grid grid-cols-2 gap-4">
      <div v-for="userNum in 12" :key="userNum" class="updown__item !py-9 animate-pulse" :class="{ '!shadow-none' : userNum >= 10 }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-team-page-loader',
}
</script>
