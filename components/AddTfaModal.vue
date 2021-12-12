<template>
  <t-modal class="flex flex-col items-center mb-15" :value="value" header="Adding new TFA" @closed="close">
    <div class="flex flex-col items-center gap-3 py-3">
      <t-input-group label="Name" class="w-10/12 mb-2" :variant="{ 'danger' : !name.trim() }">
        <t-input v-model="name" class="w-full" :variant="{ 'danger' : !name.trim() }" placeholder="Wubba Lubba dub-dub" />
      </t-input-group>

      <t-input-group label="Secret" class="w-10/12" :variant="{ 'danger' : !validateSecret() }" description="Only latin letters">
        <t-input v-model="secret" class="w-full" :variant="{ 'danger' : !validateSecret() }" placeholder="I won't tell anyone" />
      </t-input-group>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <t-button class="w-full" text="Add" variant="indigo" :disabled="isAddNewTfaDisabled" @click="save" />
        <t-button class="w-full" text="Cancel" variant="white" @click="close" />
      </div>
    </template>
  </t-modal>
</template>

<script>
import { validateTfaSecret } from '@/helpers'

export default {
  name : 'AddTfaModal',
  props: {
    value: {
      type    : Boolean,
      required: true,
    },
  },
  data () {
    return {
      name  : '',
      secret: '',
    }
  },
  computed: {
    isAddNewTfaDisabled () {
      return !this.validateSecret() || !this.name
    },
  },
  watch: {
    value (isShown) {
      if (!isShown)
        this.clearData()
    },
  },
  methods: {
    validateSecret () {
      return validateTfaSecret(this.secret)
    },
    save () {
      const tfa = { name: this.name, secret: this.secret }

      this.$emit('save', tfa)
      this.$emit('close')
    },
    close () {
      this.$emit('close')
    },
    clearData () {
      this.name = ''
      this.secret = ''
    },
  },
}
</script>
