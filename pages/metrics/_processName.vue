<template>
  <div class="pb-20">
    <b-button
      class="w-max"
      text="back"
      before-icon="left-long"
      variant="white"
      @click="$router.go(-1)"
    />

    <template v-if="stats">
      <div class="font-mono">
        <div v-for="key in ['cpuUsage', 'lastCommitDate', 'memoryUsage', 'restartsCount', 'uptime']" :key="key">
          <span>{{ key }}: </span>
          <span>{{ key === 'lastCommitDate' ? formatDate(stats[key]) : stats[key] }}</span>
        </div>
      </div>

      <div class="flex space-x-2 mb-5">
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
          :get-total-text="getCpuUsageText"
          data-key="cpuUsage"
        />

        <b-chart-line
          :data="metrics"
          :get-total-text="getMemoryUsageText"
          data-key="memoryUsage"
        />

        <b-chart-line
          v-if="hasSomeRequestsAvgLatency"
          :data="metrics"
          :get-total-text="getRequestsAvgLatencyText"
          data-key="requestsAvgLatency"
        />

        <b-chart-line
          v-if="hasSomeRequestsCount"
          :data="metrics"
          data-key="requestsCount"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { some } from 'lodash/collection'
import BChartLine from '@/components/b-chart-line'
import BButton from '@/components/b-button'
import { formatDate } from '@/helpers'

export default {
  name      : 'metric-stats',
  components: {
    'b-chart-line': BChartLine,
    'b-button'    : BButton,
  },
  computed: {
    ...mapGetters({ stats: 'metrics/getStats' }),

    processName () {
      return this.$route.params.processName
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
  },
  methods: {
    ...mapActions({ init: 'metrics/loadStats' }),

    formatDate,
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
