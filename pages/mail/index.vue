<template>
  <div class="mail h-full">
    <b-alert v-if="isLoading" text="Loading..." />

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
          <div v-if="!data.length" class="m-auto text-xl">
            no mails found
          </div>

          <b-mail-item
            v-for="mail in data"
            :key="mail._id"
            :mail="mail"
            :search="search"
            :is-active="mail._id === openedMail?._id"
            @open-mail="openMail"
          />
        </div>
        <div class="flex flex-col w-3/5">
          <div v-if="!openedMail" class="m-auto text-xl">
            choose mail
          </div>

          <b-mail-body
            v-if="openedMail"
            class="overflow-y-auto"
            :mail="openedMail"
            :search="search"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { filter, map } from 'lodash/collection'
import { mapActions } from 'vuex'
import MailItem from './components/b-mail-item'
import MailBody from './components/b-mail-body'
import PageDefaultMixin from '@/mixins/m-page-default'
import { formatDateCalendar } from '@/helpers'
import Input from '@/components/b-input'
import Button from '@/components/b-button'
import Alert from '@/components/b-alert'

export default {
  name      : 'mail',
  components: {
    'b-mail-item': MailItem,
    'b-mail-body': MailBody,
    'b-button'   : Button,
    'b-input'    : Input,
    'b-alert'    : Alert,
  },
  mixins: [PageDefaultMixin('mail')],
  data  : () => ({
    search            : '',
    openedMail        : null,
    isUpdating        : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    searchVal () {
      return this.search.toLowerCase()
    },
  },
  watch: {
    search () {
      this.onSearchChanged()
    },
    rawData () {
      this.onSearchChanged()
    },
  },
  methods: {
    ...mapActions('mail', ['setMail', 'refreshMail']),

    getPreparedData (data) {
      if (!data) return null

      return map(data, item => ({
        ...item,
        title     : item.title || 'UNTITLED',
        receivedAt: formatDateCalendar(item.receivedAt, 'HH:mm DD.MM'),
      }))
    },
    onSearchChanged () {
      let newData = this.getPreparedData(this.rawData)

      if (this.searchVal) {
        newData = filter(newData, (item) => {
          const title = item.title.toLowerCase()
          const body = item.body.toLowerCase()
          const sender = item.sender.toLowerCase()

          return title.includes(this.searchVal) || body.includes(this.searchVal) || sender.includes(this.searchVal)
        })
      }

      this.data = newData
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
