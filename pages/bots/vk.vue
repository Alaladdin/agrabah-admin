<template>
  <div>
    <div class="flex flex-col items-center self-center pb-20 w-5/12">
      <t-tag variant="subtitle" class="mb-6">Send message to the chat via bot</t-tag>
      <t-textarea v-model="message" class="mb-3 w-full min-h-40 max-h-60 self-center" :variant="{ 'danger' : !message }" />

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
import { mapActions, mapGetters } from 'vuex'
import { map } from 'lodash'

export default {
  name: 'Vk',
  data () {
    return {
      vkSendToChatId: null,
      message       : '',
      isSending     : false,
    }
  },
  computed: {
    ...mapGetters('vk', { vkChats: 'getVKChats', botConfig: 'getBotConfig' }),

    chatSelectOptions () {
      return map(this.vkChats, chat => ({
        label: chat.title,
        value: chat.chatId,
      }))
    },
    botConfigFields () {
      if (!this.botConfig) return []

      const { isBotActive, isActualityAutopostingEnabled, isConcatActualities } = this.botConfig

      return [
        {
          title    : 'Bot',
          value    : isBotActive ? 'enabled' : 'disabled',
          isEnabled: isBotActive,
        },
        {
          title    : 'Actuality autoposting',
          value    : isActualityAutopostingEnabled ? 'enabled' : 'disabled',
          isEnabled: isActualityAutopostingEnabled,
        },
        {
          title    : 'Actuality concatenation',
          value    : isConcatActualities ? 'enabled' : 'disabled',
          isEnabled: isConcatActualities,
        },
      ]
    },
    isSendDisabled () {
      return !this.message.length || this.isSending
    },
  },
  beforeDestroy () {
    this.$store.commit('vk/CLEAR_DATA')
  },
  mounted () {
    this.vkSendToChatId = this.vkChats[0].chatId
    this.loadBotConfig()
      .catch(this.$handleError)
  },
  methods: {
    ...mapActions('vk', ['sendMessage', 'loadBotConfig']),

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
