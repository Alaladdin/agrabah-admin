<template>
  <div>
    <div>
      <t-textarea v-model="message" class="mb-3 w-full h-70" />

      <div class="flex justify-end items-center">
        <t-select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
        <t-button :disabled="isSendDisabled" @click="sendMess">Send</t-button>
      </div>
    </div>

    <div v-if="botConfigFields.length">
      <h3 class="my-6 text-xl font-semibold text-center">Bot Config</h3>

      <div class="flex justify-center">
        <div class="bg-white rounded w-max">
          <div
            v-for="(field, index) in botConfigFields"
            :key="index"
            class="flex justify-between p-3 w-100 border-b-1 last:border-b-0"
          >
            <span>{{ field.title }}</span>
            <span :class="field.isEnabled ? 'text-green-400' : 'text-red-400'">{{ field.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map } from 'lodash'
import { parseError } from '@/helpers'

export default {
  name: 'Vk',
  data () {
    return {
      vkSendToChatId: null,
      message       : '- Hello there\n- General Kenobi!',
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

      const { isBotActive, actualityAutoposting } = this.botConfig

      return [
        {
          title    : 'Состояние бота',
          value    : isBotActive ? 'включен' : 'выключен',
          isEnabled: isBotActive,
        },
        {
          title    : 'Автопостинг актуалочки',
          value    : actualityAutoposting.isEnabled ? 'включен' : 'выключен',
          isEnabled: actualityAutoposting.isEnabled,
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
    this.getBotConfig()
  },
  methods: {
    ...mapActions('vk', ['sendMessage', 'getBotConfig']),

    sendMess () {
      this.isSending = true

      this.sendMessage({ message: this.message, chatId: this.vkSendToChatId })
        .then(() => {
          this.message = ''
        })
        .catch(this.onFail)
        .finally(() => {
          this.isSending = false
        })
    },
    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
