<template>
  <div class="flex h-screen w-full bg-gray-200">
    <div class="flex justify-center items-center w-full">
      <div class="text-gray-800 text-center">
        <div class="pt-40">
          <span class="block mb-3 font-bold text-9xl text-gray-900">{{ error.statusCode }}</span>
          <span class="block mb-3 font-bold text-3xl text-gray-800">Woooooooooooooops</span>

          <div class="mb-10 text-2xl text-center text-gray-800">
            {{ errorMessage }}
          </div>
        </div>

        <div v-if=" $auth.loggedIn" class="flex justify-center mb-7">
          <NuxtLink v-if="error.statusCode !== 403" class="inline-block btn mr-7" to="/" exact-active-class="">
            <fa class="mr-3" icon="long-arrow-alt-left" />
            <span>Get back</span>
          </NuxtLink>

          <Button text="Logout" btn-style="white" icon-after="sign-out-alt" @click="logout" />
        </div>

        <div class="flex">
          <img class="animate-bounce" src="~/assets/img/middle_finger_right.png" width="300">
          <img class="animate-bounce animate-delay-1" src="~/assets/img/middle_finger_left.png" width="300">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name  : 'Error',
  layout: 'single',
  props : {
    error: {
      type   : Object,
      default: () => ({}),
    },
  },
  computed: {
    errorMessage () {
      if (this.error.statusCode !== 403) return this.error.message

      return 'It\'s seems, u have no access to this super-duper page'
    },
  },
  methods: {
    logout () {
      this.$auth.logout()
        .then(() => window.location.reload())
    },
  },
}
</script>
