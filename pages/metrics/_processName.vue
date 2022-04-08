<template>
  <div class="pb-20" :class="{ 'space-y-5' : stats }">
    <div class="flex justify-between">
      <b-button
        class="w-max"
        text="back"
        before-icon="left-long"
        variant="white"
        @click="$router.go(-1)"
      />

      <b-select
        :value="period"
        :options="periodsOptions"
        variant="white"
        :disabled="!stats"
        @change="onPeriodChange"
      />
    </div>

    <b-stats-page-loader v-if="!stats" />

    <template v-if="stats">
      <div class="grid grid-cols-5 gap-5 p-5 rounded bg-white">
        <div
          v-for="data in headerData"
          :key="data.key"
          class="flex flex-col border-r-1 last:border-none"
        >
          <span class="mb-1 text-xs text-gray-400">{{ data.title }}</span>
          <div class="flex items-center">
            <fa class="mr-3 text-gray-800 !text-lg" :icon="data.icon" />
            <span class="mr-5 text-2xl font-semibold">{{ data.value }}</span>
            <div
              v-if="data.diff"
              class="badge !px-2 !py-1"
              :class="data.diff > 0 ? 'badge--danger' : 'badge--success'"
            >
              <fa class="mr-1" :icon="data.diff > 0 ? 'caret-up' : 'caret-down'" />
              <span>{{ data.diff }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="false" class="flex space-x-2">
        <b-button
          text="Start process"
          variant="indigo"
          after-icon="play"
          disabled
        />

        <b-button
          text="Stop process"
          variant="danger"
          after-icon="stop"
          disabled
        />

        <b-button
          text="Restart process"
          ariant="white"
          after-icon="rotate-right"
          disabled
        />
      </div>

      <div v-if="metrics" class="grid grid-cols-2 gap-5">
        <b-chart-line
          :data="metrics"
          :title="statsInfo.cpuUsage.title"
          data-key="cpuUsage"
          :get-total-text="getCpuUsageText"
        />

        <b-chart-line
          :data="metrics"
          :title="statsInfo.memoryUsage.title"
          data-key="memoryUsage"
          :get-total-text="getMemoryUsageText"
        />

        <b-chart-line
          v-if="hasSomeRequestsAvgLatency"
          :data="metrics"
          :title="statsInfo.requestsAvgLatency.title"
          data-key="requestsAvgLatency"
          :get-total-text="getRequestsAvgLatencyText"
        />

        <b-chart-line
          v-if="hasSomeRequestsCount"
          :data="metrics"
          data-key="requestsCount"
          :title="statsInfo.requestsCount.title"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map, reject, some, keys, find, assign } from 'lodash'
import moment from 'moment'
import localMetadata from './metadata'
import BStatsPageLoader from './components/b-stats-page-loader'
import BChartLine from '@/components/b-chart-line'
import BButton from '@/components/b-button'
import { formatDate, getOptionsFromFlatArray } from '@/helpers'
import BSelect from '@/components/b-select'

export default {
  name      : 'metric-stats',
  components: {
    'b-chart-line'       : BChartLine,
    'b-button'           : BButton,
    'b-select'           : BSelect,
    'b-stats-page-loader': BStatsPageLoader,
  },
  data: () => ({
    statsInfo     : localMetadata.statsInfo,
    periodsOptions: getOptionsFromFlatArray(localMetadata.periodsList),
    period        : localMetadata.periodsList[0],
  }),
  computed: {
    ...mapGetters({ stats: 'metrics/getStats' }),

    processName () {
      return this.$route.params.processName
    },
    headerData () {
      const excludedFields = ['_id', 'processName', 'name', 'metrics']
      const filteredStatsKeys = reject(keys(this.stats), statKey => excludedFields.includes(statKey))

      return map(filteredStatsKeys, (statKey) => {
        const value = this.stats[statKey]
        const statInfo = this.statsInfo[statKey]
        const diffNum = this.getStatDiff(statKey)

        return {
          key  : statKey,
          title: statInfo.title,
          icon : statInfo.icon,
          diff : diffNum,
          value: statInfo.valueGetter(value),
        }
      })
    },
    metrics () {
      if (this.stats) {
        const { metrics } = this.stats

        if (metrics.length)
          return metrics
      }

      return null
    },
    hasSomeRequestsAvgLatency () {
      return some(this.metrics, metric => metric.requestsAvgLatency !== null)
    },
    hasSomeRequestsCount () {
      return some(this.metrics, metric => metric.requestsCount !== null)
    },
  },
  beforeDestroy () {
    this.clearData()
  },
  created () {
    this.loadStats()
  },
  methods: {
    ...mapActions({ init: 'metrics/loadStats' }),

    loadStats () {
      const period = this.getPeriodDate(this.period)
      const data = assign({ processName: this.processName }, period)

      this.init(data)
        .then(stats => this.$setPageTitle(stats.name))
        .catch(this.$handleError)
    },
    getPeriodDate (period) {
      const todayFormatted = formatDate()
      const rules = {
        day: {
          start : todayFormatted,
          finish: todayFormatted,
        },
        week: {
          start : formatDate(moment().subtract(7, 'days')),
          finish: todayFormatted,
        },
        month: {
          start : formatDate(moment().subtract(30, 'days')),
          finish: todayFormatted,
        },
      }

      return rules[period]
    },
    getStatDiff (key) {
      if (this.metrics && ['cpuUsage', 'memoryUsage'].includes(key)) {
        const { [key]: firstStatValue } = find(this.metrics, stat => stat !== null)
        const diff = this.stats[key] - firstStatValue

        if (diff) {
          if (!firstStatValue)
            return diff

          return (diff / firstStatValue * 100).toFixed(1)
        }
      }

      return 0
    },
    onPeriodChange (period) {
      this.period = period
      this.reInit()
    },
    reInit () {
      this.clearData()
      this.loadStats()
    },
    clearData () {
      this.$store.commit('metrics/CLEAR_STATS')
    },
    getCpuUsageText (item) {
      return item.cpuUsage + '%'
    },
    getMemoryUsageText (item) {
      return item.memoryUsage + 'mb'
    },
    getRequestsAvgLatencyText (item) {
      return item.requestsAvgLatency + 'ms'
    },
  },
}
</script>
