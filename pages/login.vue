<template>
  <div class="flex justify-center items-center p-20 w-full h-full">
    <div class="flex gap-5 justify-center items-center rounded overflow-hidden w-full h-full bg-white shadow-2xl">
      <div class="flex flex-col justify-center items-center w-2/6 text-center">
        <h1 class="mb-20 font-bold text-3xl text-gray-800">
          <NuxtLink to="/">MPEI ADMIN</NuxtLink>
        </h1>

        <div class="w-8/10 min-w-70">
          <div v-if="error" class="mb-5">
            <div class="border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>

          <input v-model.trim="userData.username" :class="['input mb-3', isUsernameValid ? 'valid' : 'invalid']" type="text" placeholder="username">
          <input v-model.trim="userData.password" :class="['input mb-5', isPasswordValid ? 'valid' : 'invalid']" type="password" placeholder="password">

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
export default {
  name  : 'Login',
  layout: 'single',
  data () {
    return {
      userData: {
        username: '',
        password: '',
      },
      error    : '',
      isSigning: false,
    }
  },
  computed: {
    isUsernameValid () {
      const usernameLength = this.userData.username.length

      return usernameLength >= 4 && usernameLength <= 15
    },
    isPasswordValid () {
      const passLength = this.userData.password.length

      return passLength >= 6 && passLength <= 20
    },
    isButtonsDisabled () {
      return !this.isUsernameValid || !this.isPasswordValid || this.isSigning
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
      const { data: errorData } = error.response

      this.error = errorData ? errorData.error : error
    },
  },
}
</script>
