<template>
  <div class="mail h-full">
    <template v-if="!isLoading">
      <div class="flex items-baseline mb-2 w-full">
        <b-input
          v-model="search"
          class="mr-3 w-full"
          placeholder="Search"
        />
        <b-button
          class="h-full"
          before-icon="arrows-rotate"
          variant="indigo"
          :disabled="isUpdating"
          :loading="isUpdating"
          @click="refreshMailData"
        />
      </div>
      <div class="mail__container">
        <div class="flex flex-col w-2/5 border-r overflow-y-auto">
          <div v-if="!data.length" class="h-full self-center justify-self-center">No mails found</div>
          <b-mail-item
            v-for="mail in data"
            :key="mail._id"
            :mail="mail"
            :search="search"
            :is-active="mail._id === openedMail?._id"
            @open-mail="openMail"
          />
        </div>
        <b-mail-body
          class="w-3/5"
          :mail="openedMail"
          :search="search"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { filter, map, truncate } from 'lodash'
import { mapActions } from 'vuex'
import MailItem from './components/b-mail-item'
import MailBody from './components/b-mail-body'
import PageDefaultMixin from '@/mixins/m-page-default'
import { formatDateCalendar } from '@/helpers'
import Input from '@/components/b-input'
import Button from '@/components/b-button'

export default {
  name      : 'mail',
  components: {
    'b-mail-item': MailItem,
    'b-mail-body': MailBody,
    'b-button'   : Button,
    'b-input'    : Input,
  },
  mixins: [PageDefaultMixin('mail')],
  data  : () => ({
    search            : '',
    openedMail        : null,
    isUpdating        : false,
    clearDataOnDestroy: false,
  }),
  watch: {
    search (search) {
      const searchVal = search.toLowerCase()

      if (searchVal) {
        this.data = filter(this.rawData, (item) => {
          const itemTitle = item.title?.toLowerCase()
          const itemBody = item.body.toLowerCase()
          const itemSender = item.sender.toLowerCase()

          return itemTitle?.includes(searchVal) || itemBody.includes(searchVal) || itemSender.includes(searchVal)
        })

        this.data = this.getPreparedData(this.data)
      } else {
        this.data = this.getPreparedData(this.rawData)
      }
    },
  },
  methods: {
    ...mapActions('mail', ['setMail', 'refreshMail']),

    getPreparedData (data) {
      if (!data) return null

      return map(data, item => ({
        ...item,
        title      : item.title || '/NO_TITLE/',
        bodyPreview: truncate(item.body, { length: 60 }),
        receivers  : item.receivers.join(', '),
        receivedAt : formatDateCalendar(item.receivedAt, 'HH:mm DD.MM'),
      }))
    },
    refreshMailData () {
      this.isUpdating = true

      this.refreshMail()
        .catch(this.$handleError)
        .finally(() => {
          this.isUpdating = false
        })
    },
    openMail (mail) {
      this.openedMail = mail

      if (!mail.isRead) {
        this.setMail({ _id: mail._id, isRead: true })
          .catch(this.$handleError)
      }
    },
  },
}
</script>

<style lang='scss'>
@import 'mail';
</style>
