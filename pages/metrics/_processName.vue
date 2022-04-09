<template>
  <div class="pb-20" :class="{ 'space-y-5' : !isLoading }">
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
        :disabled="isLoading"
        @change="onPeriodChange"
      />
    </div>

    <b-stats-page-loader v-if="isLoading" />

    <template v-if="!isLoading">
      <t-alert v-if="!headerData.length" class="alert---bordered !mt-15" :dismissible="false" show>
        No available data
      </t-alert>

      <div v-if="headerData.length" class="grid grid-cols-5 gap-5 p-5 rounded bg-white">
        <div
          v-for="data in headerData"
          :key="data.key"
          class="flex flex-col border-r-1 last:border-none"
        >
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

      <div v-if="metrics" class="grid grid-cols-2 gap-5">
        <b-chart-line
          :data="metrics"
          :title="statsInfo.cpuUsage.title"
          :value-getter="getChartValueGetter('cpuUsage')"
          data-key="cpuUsage"
        />

        <b-chart-line
          :data="metrics"
          :title="statsInfo.memoryUsage.title"
          :value-getter="getChartValueGetter('memoryUsage')"
          data-key="memoryUsage"
        />

        <b-chart-line
          v-if="hasSomeRequestsAvgLatency"
          :data="metrics"
          :title="statsInfo.requestsAvgLatency.title"
          :value-getter="getChartValueGetter('requestsAvgLatency')"
          data-key="requestsAvgLatency"
        />

        <b-chart-line
          v-if="hasSomeRequestsCount"
          :data="metrics"
          :title="statsInfo.requestsCount.title"
          data-key="requestsCount"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map, reject, some, keys, find } from 'lodash'
import localMetadata from './metadata'
import BStatsPageLoader from './components/b-stats-page-loader'
import BChartLine from '@/components/b-chart-line'
import BButton from '@/components/b-button'
import { getOptionsFromFlatArray } from '@/helpers'
import BSelect from '@/components/b-select'
import PageDefaultMixin from '@/mixins/m-page-default'

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
    statsInfo     : localMetadata.statsInfo,
    period        : localMetadata.periodsList[0],
    periodDates   : localMetadata.periodDates,
    periodsOptions: getOptionsFromFlatArray(localMetadata.periodsList),
  }),
  computed: {
    ...mapGetters({ rawData: 'metrics/getStats' }),

    processName () {
      return this.$route.params.processName
    },
    headerData () {
      const excludedFields = ['_id', 'processName', 'name', 'metrics']
      const diffFields = ['cpuUsage', 'memoryUsage']
      const filteredStatsKeys = reject(keys(this.data), statKey => excludedFields.includes(statKey))

      return map(filteredStatsKeys, (statKey) => {
        const statInfo = this.statsInfo[statKey]
        const diffPercentage = diffFields.includes(statKey) && this.getStatDiffPercentage(statKey)
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
    ...mapActions({ init: 'metrics/loadStats' }),

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
      this.period = period
      this.refresh()
    },
    getStatDiffPercentage (key) {
      const { [key]: firstStatValue } = find(this.metrics, stat => stat !== null)
      const diff = this.data[key] - firstStatValue

      if (diff) {
        if (!firstStatValue)
          return diff

        return (diff / firstStatValue * 100).toFixed(1)
      }

      return 0
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
