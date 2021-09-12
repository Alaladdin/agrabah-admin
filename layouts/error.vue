<template>
  <div class="flex h-screen w-full bg-gray-200">
    <div class="flex justify-center items-center w-full">
      <div class="text-gray-800 text-center">
        <div class="pt-40">
          <span class="block mb-3 font-bold text-9xl text-gray-900">{{ error.statusCode }}</span>
          <span class="block mb-3 font-bold text-3xl text-gray-800">Woooooooooooooops</span>

          <div v-if="error.statusCode !== 403" class="mb-10 text-2xl text-center text-gray-800">
            {{ error.message }}
          </div>

          <div v-if="error.statusCode === 403" class="mb-10 text-2xl text-center text-gray-800">
            It's seems, u have no access to this <strong>super-duper</strong> page
          </div>
        </div>

        <div class="flex justify-center mb-7">
          <NuxtLink v-if="!$auth.loggedIn" to="/" :class="[ 'btn', { 'mr-5': $auth.loggedIn } ]">
            Home page
          </NuxtLink>

          <button v-if="$auth.loggedIn" class="btn btn--white" @click="logout">
            <span class="mr-3">Logout</span>
            <fa icon="sign-out-alt" />
          </button>
        </div>

        <div class="flex">
          <img src="~/assets/img/middle_finger_right.png" width="300">
          <img src="~/assets/img/middle_finger_left.png" width="300">
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
  data () {
    return {
      buttonsClassesList: ['flex', 'justify-center', 'items-center', 'py-2', 'px-3', 'font-semibold', 'rounded'],
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
        .then(() => window.location.reload())
    },
  },
}
</script>
