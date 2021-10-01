<template>
  <div
    v-anime="loginCardFadeIn()"
    class="fixed flex justify-center items-center p-20 w-full h-full opacity-0"
  >
    <div class="flex gap-5 justify-center items-center rounded overflow-hidden w-full h-full bg-white shadow-2xl">
      <div class="flex flex-col justify-center items-center w-2/6 text-center">
        <h1 v-anime="fadeIn()" class="mb-40 font-bold text-3xl text-gray-800 opacity-0">
          MPEI ADMIN
        </h1>

        <button v-anime="fadeIn({ delay: 1200 })" class="btn btn--login w-8/10 min-w-70 opacity-0" @click="login">
          <span class="bg-indigo-400 py-1 px-2 rounded">
            <fa :icon="['fab', 'discord']" />
          </span>

          <span class="flex justify-center w-full">Log in with Discord</span>
        </button>
      </div>

      <div class="flex justify-center items-center w-4/6 h-full bg-indigo-600">
        <img
          v-anime="fadeInWithTranslateY({ duration: 700, delay: 300 })"
          class="rounded-full ring-8 ring-white shadow-xl"
          src="~/assets/img/oib__orig__square.png"
          width="256"
        >
      </div>
    </div>
  </div>
</template>
<script>
import { fadeIn, fadeInWithTranslateY } from '@/animations'

export default {
  name   : 'Login',
  layout : 'single',
  methods: {
    fadeIn,
    fadeInWithTranslateY,
    loginCardFadeIn () {
      const config = {
        translateY: {
          value: [50, 0],
          delay: 200,
        },
      }

      return fadeInWithTranslateY(config)
    },
    login () {
      this.$auth.loginWith('discord')
    },
  },
}
</script>
