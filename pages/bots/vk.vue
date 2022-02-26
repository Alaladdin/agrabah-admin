<template>
  <div>
    <div class="flex flex-col items-center self-center pb-20 w-5/12">
      <t-tag variant="subtitle" class="mb-6">Send message to the chat via bot</t-tag>
      <t-textarea
        v-model="message"
        class="mb-3 w-full min-h-40 max-h-60 self-center !resize-y"
        @keydown.enter.ctrl="!isSendDisabled && sendMess()"
      />

      <div class="flex self-end items-center">
        <t-select v-model="vkSendToChatId" :options="chatSelectOptions" class="mr-5" />
        <b-button text="Send" :disabled="isSendDisabled" @click="sendMess" />
      </div>
    </div>

    <div v-if="botConfigFields.length" class="pb-15">
      <h3 class="mb-6 text-xl font-semibold text-center">Bot Config</h3>

      <div class="flex justify-center">
        <div class="bg-white rounded w-max">
          <div v-for="(field, index) in botConfigFields" :key="index" class="options">
            <span>{{ field.title }}</span>
            <span class="options__item" :class="getOptionClass(field)">
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
import { map, keys, isBoolean } from 'lodash'
import { vkChats } from '@/data'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name  : 'vk',
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

      const { isActualityAutopostingEnabled, isConcatActualities, admins, scheduleSubscribers } = this.data

      return [
        this.getBooleanConfigField(isActualityAutopostingEnabled, 'Actuality autoposting'),
        this.getBooleanConfigField(isConcatActualities, 'Actuality concatenation'),
        { title: 'Admins', value: keys(admins).join(', ') },
        { title: 'Schedule subscribers ', value: scheduleSubscribers.join(', ') },
      ]
    },
    isSendDisabled () {
      return !this.message.trim() || this.isSending
    },
  },
  methods: {
    ...mapActions('vk', ['sendMessage']),

    getBooleanConfigField (field, title) {
      return {
        title,
        value    : field ? 'enabled' : 'disabled',
        isEnabled: field,
      }
    },
    getOptionClass (field) {
      if (!isBoolean(field.isEnabled)) return ''

      return field.isEnabled ? 'options__item--success' : 'options__item--danger'
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
