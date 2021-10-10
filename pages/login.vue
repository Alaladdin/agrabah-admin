<template>
  <div class="flex justify-center items-center p-20 w-full h-full">
    <div class="flex gap-5 justify-center items-center rounded overflow-hidden w-full h-full bg-white shadow-2xl">
      <div class="flex flex-col justify-center items-center w-2/6 text-center">
        <h1 class="mb-20 font-bold text-3xl text-gray-800">
          <NuxtLink to="/">MPEI ADMIN</NuxtLink>
        </h1>

        <div class="w-8/10 min-w-70">
          <input v-model.trim="userData.username" class="px-2 py-1 mb-3 rounded border w-full" type="text" placeholder="username">
          <input v-model.trim="userData.password" class="px-2 py-1 mb-5 rounded border w-full" type="password" placeholder="password">

          <div class="flex justify-between gap-3">
            <Button class="w-full" text="Register" btn-style="indigo" :disabled="isButtonsDisabled" @click="register" />
            <Button class="w-full" text="Log in" :disabled="isButtonsDisabled" @click="login" />
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center w-4/6 h-full bg-indigo-600">
        <img class="rounded-full ring-8 ring-white shadow-xl" src="~/assets/img/oib__orig__square.png" width="256">
      </div>
    </div>
  </div>
</template>
<script>
import { parseError } from '@/helpers'

export default {
  name  : 'Login',
  layout: 'single',
  data () {
    return {
      userData: {
        username: '',
        password: '',
      },
      isSigning: false,
    }
  },
  computed: {
    isButtonsDisabled () {
      return !this.userData.username || !this.userData.password || this.isSigning
    },
  },
  methods: {
    register () {
      this.isSigning = true

      this.$axios.$post('/api/auth/register', this.userData)
        .then((user) => {
          this.$auth.setUser(user)
          this.$auth.setUserToken(user.token)
        })
        .catch(this.onFail)
        .finally(() => {
          this.isSigning = false
        })
    },
    login () {
      this.isSigning = true

      this.$auth.loginWith('local', { data: this.userData })
        .catch(this.onFail)
        .finally(() => {
          this.isSigning = false
        })
    },
    onFail (error) {
      this.$store.commit('pushError', parseError(error))
    },
  },
}
</script>
