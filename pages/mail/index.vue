<template>
  <div class="mail h-full">
    <b-alert v-if="isLoading || isBarsDataLoading" text="Loading..." />

    <b-bars-login v-if="needToLogin" class="w-3/10" />

    <template v-if="!needToLogin && !isBarsDataLoading && !isLoading">
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
          <div class="relative flex flex-col w-2/5 border-r overflow-y-auto">
            <div class="sticky top-0 flex justify-between px-3 py-2 w-full bg-purple-50 text-gray-500 text-sm z-1">
              <div>count: {{ rawData.length }}</div>

              <div class="flex space-x-3">
                <b-button
                  class="h-full text-gray-500"
                  before-icon="arrows-rotate"
                  variant="icon"
                  :disabled="isUpdating"
                  :loading="isUpdating"
                  @click="refreshMail"
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
            <b-button
              class="mt-auto !py-2 rounded-none w-full border-t text-gray-500 bg-purple-50 hover:(text-gray-500 bg-purple-100)"
              text="load more"
              variant="icon"
              disabled
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
import { assign, filter, last, map } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import MailItem from './components/b-mail-item'
import MailBody from './components/b-mail-body'
import localMetadata from './metadata'
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
    isBarsDataLoading : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    ...mapGetters({
      currentUser: 'getUserData',
      rawBarsData: 'bars/getData',
    }),

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
    needToLogin (needToLogin) {
      if (!needToLogin)
        this.initData()
    },
  },
  methods: {
    ...mapActions({
      setMail       : 'mail/setMail',
      clearMailCache: 'mail/clearMailCache',
      loadBarsData  : 'bars/init',
      removeUser    : 'bars/removeUser',
    }),

    beforeInit () {
      if (!this.barsData) {
        this.isBarsDataLoading = true

        return this.loadBarsData()
          .finally(() => {
            this.isBarsDataLoading = false
          })
      }
    },
    getPreparedData (data) {
      if (!data) return null

      return map(data, item => ({
        ...item,
        title      : item.title || 'UNTITLED',
        receivedAt : formatDateCalendar(item.receivedAt),
        attachments: map(item.attachments, (fileName) => {
          const fileExt = last(fileName.split('.'))
          const fileIcon = localMetadata.fileIcons[fileExt] || localMetadata.fileIcons.default

          return { name: fileName, icon: fileIcon }
        }),
      }))
    },
    onSearchChanged () {
      let newData = this.getPreparedData(this.rawData)

      if (this.searchVal) {
        newData = filter(newData, (item) => {
          const title = item.title.toLowerCase()
          const body = item.body?.toLowerCase()
          const from = item.from.toLowerCase()

          return title.includes(this.searchVal) || body?.includes(this.searchVal) || from.includes(this.searchVal)
        })
      }

      this.data = newData
    },
    refreshMail () {
      this.isUpdating = true

      this.clearMailCache()
        .then(this.init)
        .catch(this.$handleError)
        .finally(() => {
          this.isUpdating = false
        })
    },
    removeBarsUser () {
      this.removeUser()
        .then(this.clearData)
        .catch(this.$handleError)
    },
    openMail (mail) {
      this.openedMail = mail

      // if (!mail.isRead) {
      //   this.setMail({ _id: mail._id, isRead: true })
      //     .catch(this.$handleError)
      // }
    },
  },
}
</script>

<style lang='scss'>
@import 'mail';
</style>
