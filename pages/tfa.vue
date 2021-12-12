<template>
  <div v-if="data">
    <t-alert v-if="!data.length" class="alert---bordered" :dismissible="false" show>No any tfa here. Add something</t-alert>

    <div v-if="data.length" class="flex justify-center items-center mb-7">
      <ProgressBar class="justify-center bg-white p-3 rounded shadow" :value="tfaPercent" :text="timeRemaining + ' sec'" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div v-for="tfa in data" :key="tfa._id" :class="['updown__item', getTfaItemClass(tfa)]">
        <template v-if="!isEditingTfa(tfa)">
          <div class="text-sm select-text">
            <span>{{ tfa.name }}</span>
            <span>:</span>
            <span class="font-mono">{{ tfa.code }}</span>
          </div>

          <div class="flex gap-2">
            <t-button class="px-2" @click="startEditing(tfa)">
              <fa icon="pencil-alt" />
            </t-button>
            <t-button class="px-2" variant="danger" @click="confirmDeleteTfa(tfa)">
              <fa :icon="['far', 'trash-alt']" />
            </t-button>
          </div>
        </template>

        <template v-else>
          <t-input v-model="editingTfaData.name" :variant="{ 'danger' : !editingTfaData.name }" class="!py-1.1" placeholder="Name" />
          <span>:</span>
          <t-input v-model="editingTfaData.secret" :variant="{ 'danger' : !validateTfaSecret(editingTfaData.secret) }" class="!py-1.1" placeholder="Secret" />

          <div class="flex gap-2">
            <t-button class="px-2 !text-sm" variant="indigo" :disabled="isSaveEditedTfaDisabled" @click="editTfaData">
              <fa icon="save" />
            </t-button>
            <t-button class="px-2 !text-sm" variant="danger" @click="stopEditing">
              <fa icon="times" />
            </t-button>
          </div>
        </template>
      </div>
    </div>

    <t-button class="fixed !p-4 right-10 bottom-10 !rounded-full" variant="indigo" @click="openModal('showAddTfaModal')">
      <fa icon="plus" />
    </t-button>

    <AddTfaModal :value="showAddTfaModal" @save="addNewTfa" @close="closeModal('showAddTfaModal')" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { authenticator } from 'otplib'
import { assign, clone, map, some } from 'lodash'
import { validateTfaSecret } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name  : 'Tfa',
  mixins: [PageDefaultMixin('tfa')],
  data () {
    return {
      editingTfaData    : null,
      timeRemaining     : 0,
      tfaPercent        : 0,
      clearDataOnDestroy: false,
      showAddTfaModal   : false,
    }
  },
  computed: {
    isSaveEditedTfaDisabled () {
      const { name, secret } = this.editingTfaData

      return !name || !this.validateTfaSecret(secret)
    },
  },
  watch: {
    tfaPercent (v) {
      if (v === '100')
        this.data = this.getPreparedData(this.data)
    },
  },
  created () {
    this.setTfaVariables()
    this.startTimers()
  },
  destroyed () {
    clearInterval(this.tfasInterval)
  },
  methods: {
    ...mapActions('tfa', ['addTfa', 'editTfa', 'removeTfa']),

    validateTfaSecret,
    getPreparedData (tfas) {
      return map(tfas, (tfa) => {
        return assign({}, tfa, { code: authenticator.generate(tfa.secret) })
      })
    },
    startTimers () {
      this.tfasInterval = setInterval(this.setTfaVariables, 1000)
    },
    setTfaVariables () {
      const timeRemaining = authenticator.timeRemaining()
      const percent = (timeRemaining / 30) * 100

      this.tfaPercent = percent.toFixed()
      this.timeRemaining = timeRemaining
    },
    getTfaItemClass (tfa) {
      return {
        'opacity-20': this.editingTfaData && !this.isEditingTfa(tfa),
        '!py-2.5'   : this.isEditingTfa(tfa),
      }
    },
    addNewTfa (tfa) {
      const isSecretAlreadyExists = some(this.data, { secret: tfa.secret })

      if (isSecretAlreadyExists)
        this.$handleError('TFA with provided "secret" already exists')
      else
        this.addTfa(tfa).catch(this.$handleError)
    },
    confirmDeleteTfa (tfa) {
      const isRemoveConfirmed = confirm(`Are u sure want to delete "${tfa.name}"?`)

      if (isRemoveConfirmed)
        this.removeTfa(tfa).catch(this.$handleError)
    },
    editTfaData () {
      this.editTfa(this.editingTfaData)
        .then(this.stopEditing)
        .catch(this.$handleError)
    },
    startEditing (tfa) {
      this.editingTfaData = clone(tfa)
    },
    stopEditing () {
      this.editingTfaData = null
    },
    isEditingTfa (tfa) {
      return this.editingTfaData && this.editingTfaData._id === tfa._id
    },
  },
}
</script>
