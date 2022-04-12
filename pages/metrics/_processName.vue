<template>
  <div class="pb-20" :class="{ 'space-y-5' : !isLoading }">
    <div class="flex justify-between">
      <b-button
        text="back"
        before-icon="left-long"
        variant="white"
        @click="$router.push('/metrics')"
      />

      <div class="flex items-center space-x-3">
        <b-button
          v-if="!isLoading && canManageProcess"
          :text="data.isOnline ? 'online' : 'offline'"
          :color="data.isOnline ? '#14b8a6' : '#dc2626'"
          variant="white"
          :disabled="isTogglingProcess"
          @click="toggleProcess"
        />

        <b-select
          v-model="theme"
          :options="themesOptions"
          variant="white"
          @change="onThemeChange"
        />

        <b-select
          :value="period"
          :options="periodsOptions"
          variant="white"
          :disabled="isLoading"
          @change="onPeriodChange"
        />
      </div>
    </div>

    <b-stats-page-loader v-if="isLoading" />

    <template v-if="!isLoading">
      <t-alert v-if="!headerData.length" class="alert---bordered !mt-15" :dismissible="false" show>
        No available data
      </t-alert>

      <div v-if="headerData.length" class="grid grid-cols-4 gap-5 p-5 rounded bg-white">
        <div v-for="data in headerData" :key="data.key" class="flex flex-col border-r-1 last:border-none">
          <span class="mb-1 text-xs text-gray-400">{{ data.title }}</span>
          <div class="flex items-center">
            <fa class="mr-3 text-gray-800 !text-lg" :icon="data.icon" />
            <span class="mr-3 text-2xl font-semibold">{{ data.value }}</span>
            <div
              v-if="data.diff"
              class="badge !px-2 !rounded-full !shadow-none"
              :class="data.diff > 0 ? 'badge--danger' : 'badge--success'"
            >
              <fa class="mr-1" :icon="data.diff > 0 ? 'arrow-trend-up' : 'arrow-trend-down'" />
              <span class="inline-flex">
                <span v-if="data.diff > 0">+</span>
                <span>{{ data.diff }}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <t-alert v-if="!metrics.length" class="alert---bordered !mt-15" :dismissible="false" show>
        No available data
      </t-alert>

      <div v-if="metrics.length" class="grid grid-cols-2 gap-5">
        <b-chart-line
          :data="metrics"
          :title="statsInfo.cpuUsage.title"
          :theme="theme"
          :value-getter="getChartValueGetter('cpuUsage')"
          data-key="cpuUsage"
          :show-time="period === 'day'"
        />

        <b-chart-line
          :data="metrics"
          :title="statsInfo.memoryUsage.title"
          :theme="theme"
          :value-getter="getChartValueGetter('memoryUsage')"
          data-key="memoryUsage"
          :show-time="period === 'day'"
        />

        <b-chart-line
          v-if="hasSomeRequestsAvgLatency"
          :data="metrics"
          :title="statsInfo.requestsAvgLatency.title"
          :theme="theme"
          :value-getter="getChartValueGetter('requestsAvgLatency')"
          data-key="requestsAvgLatency"
          :show-time="period === 'day'"
        />

        <b-chart-line
          v-if="hasSomeRequestsCount"
          :data="metrics"
          :title="statsInfo.requestsCount.title"
          :theme="theme"
          data-key="requestsCount"
          :show-time="period === 'day'"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map, some, keys, find, filter } from 'lodash'
import localMetadata from './metadata'
import BStatsPageLoader from './components/b-stats-page-loader'
import BChartLine from '@/components/b-chart-line'
import BButton from '@/components/b-button'
import { getFromLocalStorage, getOptionsFromFlatArray, setToLocalStorage } from '@/helpers'
import BSelect from '@/components/b-select'
import PageDefaultMixin from '@/mixins/m-page-default'

const THEME_KEY = 'stats__theme'

export default {
  name      : 'metric-stats',
  components: {
    'b-chart-line'       : BChartLine,
    'b-button'           : BButton,
    'b-select'           : BSelect,
    'b-stats-page-loader': BStatsPageLoader,
  },
  mixins: [PageDefaultMixin('metrics')],
  data  : () => ({
    statsInfo        : localMetadata.statsInfo,
    periodsOptions   : getOptionsFromFlatArray(localMetadata.periodsList),
    periodDates      : localMetadata.periodDates,
    themesOptions    : localMetadata.themesOptions,
    period           : null,
    theme            : null,
    isTogglingProcess: false,
  }),
  computed: {
    ...mapGetters('metrics', {
      rawData      : 'getStats',
      currentPeriod: 'getPeriod',
    }),

    processName () {
      return this.$route.params.processName
    },
    canManageProcess () {
      return !['server', 'admin'].includes(this.processName)
    },
    headerData () {
      const headerFields = ['cpuUsage', 'memoryUsage', 'uptime', 'lastCommitDate', 'restartsCount']
      const filteredStatsKeys = filter(keys(this.data), statKey => headerFields.includes(statKey))

      return map(filteredStatsKeys, (statKey) => {
        const statInfo = this.statsInfo[statKey]
        const diffPercentage = ['cpuUsage', 'memoryUsage'].includes(statKey) && this.getStatDiffPercentage(statKey)
        const value = this.data[statKey]

        return {
          key  : statKey,
          title: statInfo.title,
          icon : statInfo.icon,
          diff : diffPercentage,
          value: statInfo.valueGetter(value),
        }
      })
    },
    metrics () {
      return this.data.metrics || null
    },
    hasSomeRequestsAvgLatency () {
      return some(this.metrics, metric => metric.requestsAvgLatency !== null)
    },
    hasSomeRequestsCount () {
      return some(this.metrics, metric => metric.requestsCount !== null)
    },
  },
  methods: {
    ...mapActions('metrics', {
      init            : 'loadStats',
      setProcessStatus: 'setProcessStatus',
    }),

    beforeInit () {
      this.period = this.currentPeriod || this.periodsOptions[0].value
      this.theme = getFromLocalStorage(THEME_KEY, this.themesOptions[0].value)
    },
    getInitData () {
      return {
        ...this.periodDates[this.period],
        processName: this.processName,
      }
    },
    afterInit (stats) {
      this.$setPageTitle(stats.name)
    },
    onPeriodChange (period) {
      this.$store.commit('metrics/SET_PERIOD', period)
      this.period = period
      this.refresh()
    },
    onThemeChange (theme) {
      setToLocalStorage(THEME_KEY, theme)
    },
    getStatDiffPercentage (key) {
      const firstNonNullableStat = find(this.metrics, stat => stat !== null)

      if (firstNonNullableStat) {
        const firstStatValue = firstNonNullableStat[key]
        const diff = this.data[key] - firstStatValue

        if (diff) {
          if (!firstStatValue)
            return diff

          return (diff / firstStatValue * 100).toFixed(1)
        }
      }

      return 0
    },
    toggleProcess () {
      const data = {
        processName: this.processName,
        enable     : !this.data.isOnline,
      }

      this.isTogglingProcess = true

      this.setProcessStatus(data)
        .catch(this.$handleError)
        .finally(() => {
          this.isTogglingProcess = false
        })
    },
    getChartValueGetter (key) {
      return item => this.statsInfo[key].valueGetter(item[key])
    },
    clearData () {
      this.$store.commit('metrics/CLEAR_STATS')
    },
  },
}
</script>
