<template>
  <div class="flex flex-col items-center">
    <img
      class="mb-10 rounded-full ring-8 ring-white shadow-xl"
      src="~/assets/img/oib__orig__square.png"
      width="256"
      height="256"
    >

    <p class="mb-3 font-bold text-3xl text-center text-gray-800">
      Logging out
    </p>
    <p class="mb-10 text-2xl text-center text-gray-800">
      Are u sure?
    </p>

    <div class="flex justify-between">
      <NuxtLink class="inline-block btn mr-7" to="/">
        <fa class="mr-3" icon="long-arrow-alt-left" />
        <span>Get back</span>
      </NuxtLink>

      <Button text="Logout" btn-style="white" icon-after="sign-out-alt" @click="logout" />
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
