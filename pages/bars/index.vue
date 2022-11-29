<template>
  <div class="bars">
    <b-bars-page-loader v-if="isParsing || isLoading" />

    <b-bars-login v-if="needToLogin" class="w-3/10" />

    <div v-if="!needToLogin && !isParsing && !isLoading" class="flex flex-col w-full">
      <b-bars-credentials-error
        v-if="data.isCredentialsError"
        :bars-data="data"
        :can-delete="!isUpdating"
      />

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
import BarsLogin from './components/b-bars-login'
import BarsPageLoader from './components/b-bars-page-loader'
import PageDefaultMixin from '@/mixins/m-page-default'
import { formatDate } from '@/helpers'
import BarsContent from '@/pages/bars/components/b-bars-content'
import BarsCredentialsError from '@/pages/bars/components/b-bars-credentials-error'

export default {
  name      : 'bars',
  components: {
    'b-bars-page-loader'      : BarsPageLoader,
    'b-bars-credentials-error': BarsCredentialsError,
    'b-bars-login'            : BarsLogin,
    'b-bars-content'          : BarsContent,
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
      if (needToLogin)
        this.stopBarsDataLoading()
      else if (this.isParsing)
        this.startBarsLoading()
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

      const maxTries = 5
      let triesCount = 0

      this.isUpdating = true
      this.lastUpdatedDate = this.rawData.updatedAt

      this.barsInterval = setInterval(() => {
        triesCount += 1

        this.init()
          .then(({ updatedAt }) => {
            if (this.lastUpdatedDate !== updatedAt)
              this.stopBarsDataLoading()
          })
          .catch((err) => {
            this.stopBarsDataLoading()
            this.$handleError(err)
          })

        if (triesCount >= maxTries)
          this.stopBarsDataLoading()
      }, 3 * 1000)
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
