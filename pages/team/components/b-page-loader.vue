<template>
  <div class="relative">
    <div class="absolute w-full h-full z-1 bg-gradient-to-b from-transparent to-gray-200" />
    <div class="grid grid-cols-2 gap-4">
      <div v-for="userNum in 12" :key="userNum" class="updown__item !py-9 animate-pulse" :class="{ '!shadow-none' : userNum >= 10 }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-page-loader',
}
</script>
