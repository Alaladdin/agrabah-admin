<template>
  <div class="bars">
    <b-bars-page-loader v-if="isParsing || isLoading" />

    <b-bars-login v-if="needToLogin" class="w-3/10" />

    <div v-if="!needToLogin && !isParsing && !isLoading" class="flex flex-col w-full">
      <b-alert
        v-if="data.isCredentialsError"
        custom-class="p-b-0"
        variant="danger"
      >
        <div class="p-b-4 border-b border-red-400">Credentials error</div>
        <div class="grid grid-cols-3 items-center justify-center">
          <p class="text-sm font-semibold text-red-700">{{ data.username }}</p>
          <p class="text-xs text-red-600">{{ data.updatedAt }}</p>
          <b-button
            class="!rounded-none"
            text="Delete account"
            variant="danger"
            :disabled="isUpdating"
            @click="removeBarsUser"
          />
        </div>
      </b-alert>

      <b-bars-content
        v-if="!data.isCredentialsError"
        :data="data"
        :is-updating="isUpdating"
        @refresh-marks="refreshBarsMarks"
        @remove-user="removeBarsUser"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { assign, concat, map, maxBy } from 'lodash'
import BBarsLogin from './components/b-bars-login'
import BBarsPageLoader from './components/b-bars-page-loader'
import PageDefaultMixin from '@/mixins/m-page-default'
import { formatDate } from '@/helpers'
import BBarsContent from '@/pages/bars/components/b-bars-content'
import BAlert from '@/components/b-alert'
import BButton from '@/components/b-button'

export default {
  name      : 'bars',
  components: {
    'b-bars-login'      : BBarsLogin,
    'b-bars-page-loader': BBarsPageLoader,
    'b-bars-content'    : BBarsContent,
    'b-button'          : BButton,
    'b-alert'           : BAlert,
  },
  mixins: [PageDefaultMixin('bars')],
  data  : () => ({
    isUpdating        : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),

    initOnCreate () {
      return !this.needToLogin
    },
    needToLogin () {
      return !this.currentUser.barsUser
    },
    isParsing () {
      const { marks, isCredentialsError } = this.data || {}

      return !this.needToLogin && !marks?.length && !isCredentialsError
    },
  },
  watch: {
    needToLogin (needToLogin) {
      needToLogin
        ? this.stopBarsDataLoading()
        : this.startBarsLoading()
    },
  },
  methods: {
    ...mapActions('bars', ['refreshMarks', 'removeUser']),

    getPreparedData (data) {
      if (!data) return null

      const maxMarksItem = maxBy(data.marks, ({ semester, final }) => semester.length + final.length)
      const maxMarksCount = maxMarksItem ? (maxMarksItem.semester.length + maxMarksItem.final.length) : 0
      const marks = map(data.marks, ({ discipline, semester, final }) => {
        const marksCount = semester.length + final.length
        const marksPlugs = Array(maxMarksCount - marksCount).fill('&#x2800;')

        return {
          discipline,
          semester: concat(semester, marksPlugs),
          final,
        }
      })

      return assign({}, data, {
        marks,
        updatedAt: formatDate(data.updatedAt, 'DD.MM.YYYY HH:mm'),
      })
    },
    refreshBarsMarks () {
      this.refreshMarks()
        .then(this.startBarsLoading)
        .catch(this.$handleError)
    },
    removeBarsUser () {
      this.removeUser()
        .catch(this.$handleError)
    },
    startBarsLoading () {
      this.stopBarsDataLoading()

      const MAX_TRIES = 5
      let triesCount = 0

      this.isUpdating = true

      this.barsInterval = setInterval(() => {
        triesCount += 1

        this.init()
          .then(({ marks, isCredentialsError }) => {
            if (marks.length || isCredentialsError)
              this.stopBarsDataLoading()
          })
          .catch((err) => {
            this.stopBarsDataLoading()
            this.$handleError(err)
          })

        if (triesCount >= MAX_TRIES)
          this.stopBarsDataLoading()
      }, 1000 * 10)
    },
    stopBarsDataLoading () {
      this.isUpdating = false
      clearInterval(this.barsInterval)
    },
  },
}
</script>

<style lang='scss'>
@import 'bars';
</style>
