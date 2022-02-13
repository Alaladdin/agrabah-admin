<template>
  <div class="flex h-screen w-full bg-gray-200">
    <div class="flex justify-center items-center w-full">
      <div class="text-gray-800 text-center">
        <div class="pt-20 mb-10">
          <span class="block mb-5 font-bold text-9xl text-gray-900">{{ error.statusCode }}</span>
          <span class="block mb-3 font-bold text-3xl text-gray-800">Woooooooooooooops</span>

          <div class="text-2xl text-center text-gray-800">
            {{ errorMessage }}
          </div>
        </div>

        <NuxtLink class="flex justify-center mb-15 !bg-transparent" to="/">
          <b-button v-if="error.statusCode !== 403" class="text-base" text="Go home" />
        </NuxtLink>

        <div class="flex">
          <nuxt-img preset="default" class="animate-bounce" src="middle_finger_right.png" width="200" />
          <nuxt-img preset="default" class="animate-bounce animate-bounce-reverse" src="middle_finger_left.png" width="200" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name  : 'error',
  layout: 'single',
  props : {
    error: {
      type   : Object,
      default: () => ({}),
    },
  },
  computed: {
    errorMessage () {
      if (this.error.statusCode !== 403)
        return this.error.message

      return 'It\'s seems, u have no access to this super-duper page'
    },
  },
}
</script>
