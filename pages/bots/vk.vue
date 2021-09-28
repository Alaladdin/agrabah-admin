<template>
  <div class="">
    <textarea v-model="message" class="textarea mb-5 h-70 resize-none" />

    <div class="flex justify-end items-center">
      <Select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
      <Button class="w-min" text="Send" :disabled="isSendDisabled" @click="sendMess" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { each } from 'lodash'

export default {
  name: 'Vk',
  data () {
    return {
      vkSendToChatId: null,
      message       : '- Hello there\n- General Kenobi',
      isSending     : false,
    }
  },
  computed: {
    ...mapGetters('vk', { vkChats: 'getVKChats' }),

    chatSelectOptions () {
      const options = []

      each(Object.keys(this.vkChats), (chatKey) => {
        options.push({
          title: chatKey,
          value: this.vkChats[chatKey],
        })
      })

      return options
    },
    isSendDisabled () {
      return this.message.length < 5 || this.isSending
    },
  },
  mounted () {
    this.vkSendToChatId = this.vkChats.main
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
