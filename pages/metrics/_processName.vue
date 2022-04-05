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
          {{ key + ': ' + stats[key] }}
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
          data-key="cpuUsage"
        />

        <b-chart-line
          :data="metrics"
          data-key="memoryUsage"
        />

        <b-chart-line
          v-if="metrics[0].requestsAvgLatency"
          :data="metrics"
          data-key="requestsAvgLatency"
        />

        <b-chart-line
          v-if="metrics[0].requestsCount"
          :data="metrics"
          data-key="requestsCount"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BChartLine from '@/components/b-chart-line'
import BButton from '@/components/b-button'

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
  },
  beforeMount () {
    this.$setPageTitle(this.processName)
  },
  created () {
    this.init(this.processName)
      .then((stats) => {
        this.$setPageTitle(stats.name)
      })
  },
  methods: {
    ...mapActions({ init: 'metrics/loadStats' }),
  },
}
</script>
