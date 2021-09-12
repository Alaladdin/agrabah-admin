<template>
  <div class="text-gray-800">
    <div>
      <div class="mb-3 font-bold text-3xl text-center text-gray-800">
        Logging out
      </div>
      <div class="mb-10 text-2xl text-center text-gray-800">
        Are u sure?
      </div>
    </div>

    <div class="flex justify-between">
      <NuxtLink to="/">
        <button class="btn mr-20">
          <fa class="mr-3" icon="long-arrow-alt-left" />
          <span>Get back</span>
        </button>
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
