<template>
  <div>
    <div>
      <textarea v-model.trim="message" class="textarea mb-5 h-70 resize-none" />

      <div class="flex justify-end items-center">
        <Select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
        <Button text="Send" :disabled="isSendDisabled" :loading="isSending" @click="sendMess" />
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
  name      : 'Vk',
  middleware: ['admin'],
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
        title: chat.title,
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
      this.$store.commit('pushError', parseError(error))
    },
  },
}
</script>
