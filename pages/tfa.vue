<template>
  <div v-if="currentTfas">
    <div v-if="currentTfas.length" class="flex justify-center items-center mb-7">
      <ProgressBar class="justify-center bg-white p-3 rounded shadow" :value="tfaPercent" :text="timeRemaining + ' sec'" />
    </div>

    <t-alert v-if="!currentTfas.length" class="alert---bordered" :dismissible="false" show>No any tfa here. Add something</t-alert>

    <div class="grid grid-cols-2 gap-3">
      <div v-for="tfa in currentTfas" :key="tfa._id" :class="['updown__item', getTfaItemClass(tfa)]">
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
          <t-input v-model="editingTfaData.secret" :variant="{ 'danger' : !editingTfaData.secret }" class="!py-1.1" placeholder="Secret" />

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

    <t-button class="fixed !p-4 right-10 bottom-10 !rounded-full" variant="indigo" @click="openModal('showAddingTfaModal')">
      <fa icon="plus" />
    </t-button>

    <AddTfaModal :value="showAddingTfaModal" @save="addNewTfa" @close="closeModal('showAddingTfaModal')" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { authenticator } from 'otplib'
import { assign, clone, map, some } from 'lodash'
import { validateTfaSecret } from '@/helpers'

export default {
  name: 'Tfa',
  data () {
    return {
      currentTfas       : null,
      editingTfaData    : null,
      timeRemaining     : 0,
      tfaPercent        : 0,
      showAddingTfaModal: false,
    }
  },
  computed: {
    ...mapGetters('tfa', { tfas: 'getTfas' }),

    isSaveEditedTfaDisabled () {
      const { name, secret } = this.editingTfaData

      return !validateTfaSecret(secret) || !name || !secret
    },
  },
  watch: {
    tfas: {
      immediate: true,
      handler (tfas) {
        if (tfas)
          this.prepareTfas(tfas)
      },
    },
    tfaPercent (v) {
      if (v === '100')
        this.prepareTfas(this.currentTfas)
    },
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('tfa', ['loadTfas', 'addTfa', 'editTfa', 'removeTfa']),

    init () {
      this.beforeInit()

      if (!this.tfas) {
        this.loadTfas()
          .then(this.afterInit)
          .catch(this.$handleError)
      } else {
        this.afterInit()
      }
    },
    beforeInit () {
      this.setTfaVariables()
    },
    afterInit () {
      setInterval(() => this.setTfaVariables(), 1000)
    },
    setTfaVariables () {
      const timeRemaining = authenticator.timeRemaining()
      const percent = (timeRemaining / 30) * 100

      this.tfaPercent = percent.toFixed()
      this.timeRemaining = timeRemaining
    },
    prepareTfas (tfas) {
      this.currentTfas = map(tfas, (tfa) => {
        return assign({}, tfa, { code: authenticator.generate(tfa.secret) })
      })
    },
    getTfaItemClass (tfa) {
      return {
        'opacity-20': this.editingTfaData && !this.isEditingTfa(tfa),
        '!py-2.5'   : this.isEditingTfa(tfa),
      }
    },
    addNewTfa (tfa) {
      const isTfaAlreadyExists = some(this.currentTfas, i => i.secret === this.secret)

      if (isTfaAlreadyExists)
        this.$handleError('TFA with provided secret already exists')
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
    openModal (field) {
      this[field] = true
    },
    closeModal (field) {
      this[field] = false
    },
  },
}
</script>
