<template>
  <div class="flex flex-col justify-center">
    <span class="mb-20 font-bold text-3xl text-center text-gray-800">MPEI ADMIN</span>

    <button class="btn btn--login" @click="login">
      <span class="bg-indigo-400 py-1 px-2 rounded">
        <fa :icon="['fab', 'discord']" />
      </span>

      <span class="flex justify-center text-center w-100">Log in with Discord</span>
    </button>
  </div>
</template>
<script>
export default {
  name   : 'Login',
  layout : 'single',
  methods: {
    login () {
      this.$auth.loginWith('discord')
    },
  },
}
</script>
