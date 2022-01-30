<template>
  <div class="flex flex-col items-center">
    <NuxtImg
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
      <t-button class="mr-7" to="/">
        <fa class="mr-4" icon="long-arrow-alt-left" />
        <span>Get back</span>
      </t-button>

      <t-button variant="white" @click="logout">
        <span class="mr-4">Logout</span>
        <fa icon="sign-out-alt" />
      </t-button>
    </div>
  </div>
</template>

<script>
export default {
  name   : 'logout',
  layout : 'single',
  methods: {
    logout () {
      this.$auth.logout()
    },
  },
}
</script>
