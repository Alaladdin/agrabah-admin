<template>
  <form class="self-center space-y-5" @submit.prevent="!isSaveDisabled && setBarsUser()">
    <b-input
      v-model="username"
      label="Username"
      :disabled="isSaving"
      required
    />
    <b-input
      v-model="password"
      label="Password"
      type="password"
      :disabled="isSaving"
      required
    />
    <b-button
      class="ml-auto"
      text="Save"
      variant="indigo"
      :disabled="isSaveDisabled"
      @click="setBarsUser"
    />
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import BInput from '@/components/b-input'
import BButton from '@/components/b-button'

export default {
  name      : 'b-bars-login',
  components: {
    'b-input' : BInput,
    'b-button': BButton,
  },
  data: () => ({
    username: '',
    password: '',
    isSaving: false,
  }),
  computed: {
    isSaveDisabled () {
      return !this.username || !this.password || this.isSaving
    },
  },
  methods: {
    ...mapActions('bars', ['setUser']),

    setBarsUser () {
      this.isSaving = true

      this.setUser({ username: this.username, password: this.password })
        .catch(this.$handleError)
        .finally(() => {
          this.isSaving = false
        })
    },
  },
}
</script>
