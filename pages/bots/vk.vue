<template>
  <div class="">
    <textarea v-model.trim="message" class="textarea mb-5 h-70 resize-none" />

    <div class="flex justify-end items-center">
      <Select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
      <Button text="Send" :disabled="isSendDisabled" :loading="isSending" @click="sendMess" />
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
    ...mapGetters('vk', { vkChats: 'getVKChats' }),

    chatSelectOptions () {
      return map(this.vkChats, chat => ({
        title: chat.title,
        value: chat.chatId,
      }))
    },
    isSendDisabled () {
      return this.message.length < 5 || this.isSending
    },
  },
  mounted () {
    this.vkSendToChatId = this.vkChats[0].chatId
  },
  methods: {
    ...mapActions('vk', ['sendMessage']),

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
