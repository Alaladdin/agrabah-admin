<template>
  <div class="flex justify-center items-center p-20 w-full h-full">
    <div class="flex gap-5 justify-center items-center rounded overflow-hidden w-full h-full bg-white shadow-2xl">
      <div class="flex flex-col justify-center items-center w-2/6 text-center">
        <h1 class="mb-20 font-bold text-3xl text-gray-800">
          <NuxtLink to="/">AGRABAH ADMIN</NuxtLink>
        </h1>

        <form class="w-8/10 min-w-70" @submit.prevent="login">
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
          />
          <t-input
            v-model="userData.password"
            class="mb-5 w-full"
            :variant="isPasswordValid ? 'success' : 'danger'"
            type="password"
            maxlength="20"
            placeholder="password"
          />

          <div class="flex justify-between gap-3">
            <b-button
              class="w-full py-1.5"
              text="Register"
              type="button"
              :disabled="isButtonsDisabled"
              @click.prevent="register"
            />
            <b-button
              class="w-full py-1.5"
              text="Log in"
              variant="indigo"
              type="submit"
              :disabled="isButtonsDisabled"
              @click.prevent="login"
            />
          </div>
        </form>
      </div>

      <div class="flex justify-center items-center w-4/6 h-full bg-indigo-600">
        <nuxt-img preset="default" class="rounded-full ring-8 ring-white shadow-xl" src="oib__orig__square.png" width="256" />
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
    register () {
      this.beforeRequest()

      this.$axios.$post('/api/auth/register', this.userData)
        .then(data => this.applyUser(data.user))
        .catch(this.onFail)
        .finally(() => {
          this.isSigning = false
        })
    },
    login () {
      this.beforeRequest()

      this.$auth.loginWith('local', { data: this.userData })
        .then(result => this.applyUser(result.data.user))
        .catch(this.onFail)
        .finally(() => {
          this.isSigning = false
        })
    },
    beforeRequest () {
      this.isSigning = true
      this.error = ''
    },
    applyUser (user) {
      this.$auth.setUser(user)
      this.$auth.setUserToken(user.token)
    },
    onFail (res) {
      this.error = res.error
    },
  },
}
</script>
