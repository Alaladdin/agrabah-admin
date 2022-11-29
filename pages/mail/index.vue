<template>
  <div class="mail h-full">
    <b-alert v-if="isLoading" text="Loading..." />

    <b-bars-login v-if="needToLogin" class="w-3/10" />

    <template v-if="!needToLogin && !isLoading">
      <b-bars-credentials-error
        v-if="barsData.isCredentialsError"
        :bars-data="barsData"
        :can-delete="!isUpdating"
      />

      <template v-if="!barsData.isCredentialsError">
        <b-input
          v-model="search"
          class="mail__search"
          placeholder="Search"
        />

        <div class="mail__container">
          <div class="flex flex-col w-2/5 border-r overflow-y-auto">
            <div class="sticky top-0 flex justify-between px-3 py-2 w-full bg-purple-50 text-gray-500 text-sm z-1">
              <div>count: {{ rawData.length }}</div>

              <div class="flex space-x-3">
                <div>updated at: {{ barsData.updatedAt }}</div>
                <b-button
                  class="h-full text-gray-500"
                  before-icon="arrows-rotate"
                  variant="icon"
                  :disabled="isUpdating"
                  :loading="isUpdating"
                  @click="refreshMailData"
                />
                <b-button
                  class="h-full text-red-400"
                  before-icon="trash-can"
                  variant="icon"
                  :disabled="isUpdating"
                  @click="removeBarsUser"
                />
              </div>
            </div>

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
    </template>
  </div>
</template>

<script>
import { assign, filter, map } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import MailItem from './components/b-mail-item'
import MailBody from './components/b-mail-body'
import PageDefaultMixin from '@/mixins/m-page-default'
import { formatDate, formatDateCalendar } from '@/helpers'
import Input from '@/components/b-input'
import Button from '@/components/b-button'
import Alert from '@/components/b-alert'
import BarsLogin from '@/pages/bars/components/b-bars-login'
import BarsCredentialsError from '@/pages/bars/components/b-bars-credentials-error'

export default {
  name      : 'mail',
  components: {
    'b-mail-item'             : MailItem,
    'b-mail-body'             : MailBody,
    'b-bars-login'            : BarsLogin,
    'b-bars-credentials-error': BarsCredentialsError,
    'b-button'                : Button,
    'b-input'                 : Input,
    'b-alert'                 : Alert,
  },
  mixins: [PageDefaultMixin('mail')],
  data  : () => ({
    search            : '',
    openedMail        : null,
    isUpdating        : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    ...mapGetters({ currentUser: 'getUserData', rawBarsData: 'bars/getData' }),

    barsData () {
      if (!this.rawBarsData)
        return null

      return assign({}, this.rawBarsData, {
        updatedAt: formatDate(this.rawBarsData.updatedAt, 'HH:mm DD.MM'),
      })
    },
    searchVal () {
      return this.search.toLowerCase()
    },
    needToLogin () {
      return !this.currentUser.barsUser
    },
    initOnCreate () {
      return !this.needToLogin
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
    ...mapActions({
      setMail     : 'mail/setMail',
      refreshMail : 'mail/refreshMail',
      loadBarsData: 'bars/init',
      removeUser  : 'bars/removeUser',
    }),

    beforeInit () {
      if (!this.barsData)
        return this.loadBarsData()
    },
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
      this.refreshMail()
        .then(this.startMailLoading)
        .catch(this.$handleError)
    },
    startMailLoading () {
      this.stopMailDataLoading()

      const maxTries = 5
      let triesCount = 0

      this.isUpdating = true
      this.lastUpdatedDate = this.barsData.updatedAt

      this.mailInterval = setInterval(() => {
        triesCount += 1

        this.loadBarsData()
          .then(({ updatedAt }) => {
            if (this.lastUpdatedDate !== updatedAt) {
              this.init()
              this.stopMailDataLoading()
            }
          })
          .catch((err) => {
            this.stopMailDataLoading()
            this.$handleError(err)
          })

        if (triesCount >= maxTries)
          this.stopMailDataLoading()
      }, 30 * 1000)
    },
    stopMailDataLoading () {
      this.isUpdating = false
      clearInterval(this.mailInterval)
    },
    removeBarsUser () {
      this.removeUser()
        .then(this.clearData)
        .catch(this.$handleError)
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
