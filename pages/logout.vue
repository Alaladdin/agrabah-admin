<template>
  <div class="flex flex-col items-center">
    <img
      class="mb-10 rounded-full ring-8 ring-white shadow-xl"
      src="~/assets/img/oib__orig__square.png"
      width="256"
      height="256"
    >

    <div class="mb-3 font-bold text-3xl text-center text-gray-800">
      Logging out
    </div>
    <div class="mb-10 text-2xl text-center text-gray-800">
      Are u sure?
    </div>

    <div class="flex justify-between">
      <NuxtLink class="inline-block btn mr-7" to="/">
        <fa class="mr-3" icon="long-arrow-alt-left" />
        <span>Get back</span>
      </NuxtLink>

      <button class="btn btn--white" @click="logout">
        <span class="mr-3">Logout</span>
        <fa icon="sign-out-alt" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name   : 'Logout',
  layout : 'single',
  methods: {
    logout () {
      this.$auth.logout()
    },
  },
}
</script>
