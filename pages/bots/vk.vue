<template>
  <div>
    <div>
      <textarea v-model.trim="message" class="textarea mb-5 h-70 resize-none" />

      <div class="flex justify-end items-center">
        <Select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
        <Button text="Send" :disabled="isSendDisabled" :loading="isSending" @click="sendMess" />
      </div>
    </div>

    <div>
      <h3 class="my-6 text-xl font-semibold text-center">
        Bot Config
      </h3>

      <div class="flex justify-center">
        <div class="bg-white p-3 rounded w-max">
          <div
            v-for="({ title,value }, index) in botConfigFields"
            :key="index"
            class="flex justify-between p-1 w-100"
          >
            {{ title }} <span>{{ value }}</span>
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

      const { isEnabled: isAutopostingEnabled } = this.botConfig.actualityAutoposting

      return [
        {
          title: 'Состояние бота',
          value: this.botConfig ? 'включен' : 'выключен',
        },
        {
          title: 'Автопостинг актуалочки',
          value: isAutopostingEnabled ? 'включен' : 'выключен',
        },
      ]
    },
    isSendDisabled () {
      return this.message.length < 5 || this.isSending
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
        .catch(console.error)
        .finally(() => {
          this.isSending = false
        })
    },
  },
}
</script>
