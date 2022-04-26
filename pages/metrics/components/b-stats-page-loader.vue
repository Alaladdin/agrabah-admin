<template>
  <div class="relative space-y-5 animate-pulse">
    <div class="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-200" />
    <div class="grid grid-cols-5 gap-5 p-5 pt-6 rounded h-23 bg-white">
      <div
        v-for="i in 4"
        :key="`header__${i}`"
        class="flex flex-col border-r-1 last:border-none"
      >
        <span class="mb-3 rounded-full w-23 h-2.5 bg-gray-300" />
        <div class="flex items-center space-x-3">
          <span class="w-5 h-5 rounded-full bg-gray-300" />
          <span class="w-15 h-2.5 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded w-full h-51 bg-white"
        :class="{ 'shadow-sm' : i < 3 }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-stats-page-loader',
}
</script>
