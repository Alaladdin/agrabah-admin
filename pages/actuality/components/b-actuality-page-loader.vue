<template>
  <div class="relative animate-pulse">
    <div class="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-200" />

    <div class="rounded rounded-t-none bg-white">
      <div v-for="i in 13" :key="i" class="options !w-full h-14">
        <div class="flex items-center w-full">
          <span class="rounded-full w-40 h-2.5 bg-gray-300" />
        </div>

        <div class="flex items-center space-x-5">
          <span class="rounded-full w-20 h-2.5 bg-gray-300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-actuality-page-loader',
}
</script>
