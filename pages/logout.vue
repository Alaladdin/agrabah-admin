<template>
  <div class="flex flex-col items-center">
    <nuxt-img
      preset="default"
      class="mb-10 rounded-full ring-8 ring-white shadow-xl"
      src="oib__orig__square.png"
      width="256"
      height="256"
    />
    <t-tag class="mb-5" variant="title">Logging out</t-tag>
    <t-tag class="mb-10 text-2xl font-normal" variant="subtitle">
      <span class="text-gray-700">Are u sure?</span>
    </t-tag>

    <div class="flex justify-between">
      <b-button class="mr-5" text="Get back" before-icon="left-long" @click="goBack" />
      <b-button text="Logout" after-icon="right-from-bracket" variant="white" @click="logout" />
    </div>
  </div>
</template>

<script>
export default {
  name   : 'logout',
  layout : 'single',
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    logout () {
      this.$auth.logout()
    },
  },
}
</script>
