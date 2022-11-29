<template>
  <b-alert custom-class="p-b-0" variant="danger">
    <div class="p-b-4 border-b border-red-400">Credentials error</div>
    <div class="grid grid-cols-3 items-center justify-center">
      <p class="text-sm font-semibold text-red-700">{{ barsData.username }}</p>
      <p class="text-xs text-red-600">{{ barsData.updatedAt }}</p>
      <b-button
        class="!rounded-none"
        text="Delete account"
        variant="danger"
        :disabled="!canDelete"
        @click="removeBarsUser"
      />
    </div>
  </b-alert>
</template>

<script>
import { mapActions } from 'vuex'
import Alert from '@/components/b-alert'
import Button from '@/components/b-button'

export default {
  name      : 'b-bars-credentials-error',
  components: {
    'b-alert' : Alert,
    'b-button': Button,
  },
  props: {
    barsData: {
      type   : Object,
      default: () => ({}),
    },
    canDelete: {
      type   : Boolean,
      default: true,
    },
  },
  methods: {
    ...mapActions('bars', ['removeUser']),

    removeBarsUser () {
      this.removeUser()
        .catch(this.$handleError)
    },
  },
}
</script>
