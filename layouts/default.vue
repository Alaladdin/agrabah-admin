<template>
  <div class="flex bg-gray-200">
    <SideBar />

    <div class="flex justify-center w-full">
      <div class="flex flex-col pt-32 w-4/6 h-full">
        <div class="flex flex-col h-full">
          <span class="mb-10 font-bold text-3xl text-gray-800 text-center">{{ capitalize($nuxt.$route.name) }}</span>
          <Nuxt class="flex flex-col" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { capitalize } from '../helpers'

export default {
  name   : 'Default',
  methods: {
    capitalize,
  },
}
</script>
