<template>
  <div class="pb-20" :class="{ 'space-y-5' : stats }">
    <b-button
      class="w-max"
      text="back"
      before-icon="left-long"
      variant="white"
      @click="$router.go(-1)"
    />

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
            <span class="text-2xl font-semibold">{{ data.value }}</span>
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

    <b-stats-page-loader v-if="!stats" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map, reject, some, keys } from 'lodash'
import localMetadata from './metadata'
import BStatsPageLoader from './components/b-stats-page-loader'
import BChartLine from '@/components/b-chart-line'
import BButton from '@/components/b-button'

export default {
  name      : 'metric-stats',
  components: {
    'b-chart-line'       : BChartLine,
    'b-button'           : BButton,
    'b-stats-page-loader': BStatsPageLoader,
  },
  data: () => ({
    statsInfo: localMetadata.statsInfo,
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

        return {
          key  : statKey,
          title: statInfo.title,
          icon : statInfo.icon,
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
    this.$store.commit('metrics/CLEAR_STATS')
  },
  created () {
    this.init(this.processName)
      .then(stats => this.$setPageTitle(stats.name))
      .catch(this.$handleError)
  },
  methods: {
    ...mapActions({ init: 'metrics/loadStats' }),

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
