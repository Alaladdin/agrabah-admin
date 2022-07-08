<template>
  <div class="bars">
    <b-bars-page-loader v-if="isLoading" />

    <b-bars-login v-if="needToLogin" class="w-3/10" />

    <div v-if="!needToLogin && !isLoading" class="flex flex-col w-full">
      <t-alert
        v-if="!data.marks.length && !data.isCredentialsError"
        class="alert---bordered mb-5 !w-full animate-pulse"
        :dismissible="false"
        show
      >
        Bars is parsing now
      </t-alert>

      <t-alert
        v-if="data.isCredentialsError"
        class="alert---bordered mb-5 !w-full"
        variant="danger"
        :dismissible="false"
        show
      >
        Credentials error
      </t-alert>

      <b-bars-content :data="data" :is-updating="isUpdating" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { assign, concat, map, maxBy } from 'lodash'
import BBarsLogin from './components/b-bars-login'
import BBarsPageLoader from './components/b-bars-page-loader'
import PageDefaultMixin from '@/mixins/m-page-default'
import { formatDate } from '@/helpers'
import BBarsContent from '@/pages/bars/components/b-bars-content'

export default {
  name      : 'bars',
  components: {
    'b-bars-login'      : BBarsLogin,
    'b-bars-page-loader': BBarsPageLoader,
    'b-bars-content'    : BBarsContent,
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
  },
  watch: {
    needToLogin (needToLogin) {
      needToLogin
        ? this.stopBarsDataLoading()
        : this.startBarsLoading()
    },
  },
  methods: {
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
