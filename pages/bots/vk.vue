<template>
  <div>
    <div class="flex flex-col items-center self-center pb-20 w-5/12">
      <t-tag variant="subtitle" class="mb-6">Send message to the chat via bot</t-tag>
      <t-textarea v-model="message" class="mb-3 w-full min-h-40 max-h-60 self-center !resize-y" :variant="{ 'danger' : !message.trim() }" />

      <div class="flex self-end items-center">
        <t-select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
        <t-button :disabled="isSendDisabled" @click="sendMess">Send</t-button>
      </div>
    </div>

    <div v-if="botConfigFields.length" class="pb-15">
      <h3 class="mb-6 text-xl font-semibold text-center">Bot Config</h3>

      <div class="flex justify-center">
        <div class="bg-white rounded w-max">
          <div v-for="(field, index) in botConfigFields" :key="index" class="options">
            <span>{{ field.title }}</span>
            <span :class="['options__item', field.isEnabled ? 'options__item--success' : 'options__item--danger']">
              {{ field.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { map } from 'lodash'
import { vkChats } from '@/data'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name  : 'Vk',
  mixins: [PageDefaultMixin('vk')],
  data () {
    return {
      vkSendToChatId: vkChats[0].chatId,
      message       : '',
      isSending     : false,
    }
  },
  computed: {
    chatSelectOptions () {
      return map(vkChats, chat => ({ label: chat.title, value: chat.chatId }))
    },
    botConfigFields () {
      if (!this.data) return []

      const { isBotActive, isActualityAutopostingEnabled, isConcatActualities } = this.data

      return [
        this.getConfigField(isBotActive, 'Bot'),
        this.getConfigField(isActualityAutopostingEnabled, 'Actuality autoposting'),
        this.getConfigField(isConcatActualities, 'Actuality concatenation'),
      ]
    },
    isSendDisabled () {
      return !this.message.trim() || this.isSending
    },
  },
  methods: {
    ...mapActions('vk', ['sendMessage']),

    getConfigField (field, title) {
      return {
        title,
        value    : field ? 'enabled' : 'disabled',
        isEnabled: field,
      }
    },
    sendMess () {
      this.isSending = true

      this.sendMessage({ message: this.message, chatId: this.vkSendToChatId })
        .then(() => {
          this.message = ''
        })
        .catch(this.$handleError)
        .finally(() => {
          this.isSending = false
        })
    },
  },
}
</script>
