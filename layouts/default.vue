<template>
  <div class="flex bg-gray-200">
    <SideBar />

    <div class="flex justify-center w-full">
      <div class="flex flex-col pt-32 w-3/5 h-full">
        <div class="flex flex-col h-full">
          <span class="mb-10 font-bold text-3xl text-gray-800 text-center">{{ $nuxt.$route.name }}</span>
          <Nuxt class="flex flex-col" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Default',
}
</script>
