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

          <t-input
            v-model="userData.username"
            class="mb-3 w-full"
            :variant="isUsernameValid ? 'success' : 'danger'"
            maxlength="15"
            placeholder="username"
            @keydown.enter="onEnter"
          />
          <t-input
            v-model="userData.password"
            class="mb-5 w-full"
            :variant="isPasswordValid ? 'success' : 'danger'"
            type="password"
            maxlength="20"
            placeholder="password"
            @keydown.enter="onEnter"
          />

          <div class="flex justify-between gap-3">
            <t-button class="w-full py-1.5" text="Register" :disabled="isButtonsDisabled" @click="register" />
            <t-button class="w-full py-1.5" text="Log in" variant="indigo" :disabled="isButtonsDisabled" @click="login" />
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center w-4/6 h-full bg-indigo-600">
        <NuxtImg preset="default" class="rounded-full ring-8 ring-white shadow-xl" src="oib__orig__square.png" width="256" />
      </div>
    </div>
  </div>
</template>
<script>
import { validateUsername, validatePassword } from '@/helpers'

export default {
  name  : 'login',
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
    isButtonsDisabled () {
      return !this.isUsernameValid || !this.isPasswordValid || this.isSigning
    },
    isUsernameValid () {
      return validateUsername(this.userData.username)
    },
    isPasswordValid () {
      return validatePassword(this.userData.password)
    },
  },
  methods: {
    onEnter () {
      if (!this.isButtonsDisabled)
        this.login()
    },
    register () {
      this.beforeRequest()

      this.$axios.$post('/api/auth/register', this.userData)
        .then(({ user }) => {
          this.$auth.setUser(user)
          this.$auth.setUserToken(user.token)
        })
        .catch(this.onFail)
        .finally(() => {
          this.isSigning = false
        })
    },
    login () {
      this.beforeRequest()

      this.$auth.loginWith('local', { data: this.userData })
        .catch(this.onFail)
        .finally(() => {
          this.isSigning = false
        })
    },
    beforeRequest () {
      this.isSigning = true
      this.error = ''
    },
    onFail (res) {
      this.error = res.error
    },
  },
}
</script>
