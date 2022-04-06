<template>
  <div>
    <t-alert v-if="isLoading" class="alert---bordered" :dismissible="false" show>
      Loading...
    </t-alert>

    <template v-if="!isLoading">
      <t-alert v-if="!data.length" class="alert---bordered" :dismissible="false" show>
        No available data to show
      </t-alert>

      <template v-if="data.length">
        <t-alert class="alert---bordered mb-7" :show="showCachedAlert" @hidden="onAlertClose('cached')">
          Results are cached for 30 mins
        </t-alert>

        <div class="bg-white rounded w-full">
          <div v-for="metric in data" :key="metric.processName" class="options !w-full">
            <b-button :text="metric.name" variant="link" @click="openMetricStatsPage(metric)" />
            <div class="options__item flex items-center space-x-5">
              <div class="inline-flex badge badge--indigo">{{ metric.version }}</div>
              <div :class="metric.isOnline ? 'text-green-400' : 'text-red-400'">
                {{ metric.isOnline ? 'online' : 'offline' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { keys } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'
import { setToLocalStorage, getFromLocalStorage } from '@/helpers'
import BButton from '@/components/b-button'

export default {
  name      : 'metrics',
  components: {
    'b-button': BButton,
  },
  mixins: [PageDefaultMixin('metrics')],
  data  : () => ({
    showCachedAlert   : true,
    clearDataOnDestroy: false,
  }),
  computed: {
    tableHeader () {
      return this.data ? keys(this.data[0]) : []
    },
  },
  created () {
    const key = this.getPrefixedAlertId('cached')

    this.showCachedAlert = !getFromLocalStorage(key)
  },
  methods: {
    openMetricStatsPage ({ processName }) {
      this.$router.push({ name: 'metrics/processName', params: { processName } })
    },
    onAlertClose (id) {
      const key = this.getPrefixedAlertId(id)

      setToLocalStorage(key, true)
    },
    getPrefixedAlertId (id) {
      return `metrics_alert_closed:${id}`
    },
  },
}
</script>
