<template>
  <div>
    <t-alert v-if="isLoading" class="alert---bordered" :dismissible="false" show>
      Loading...
    </t-alert>

    <template v-if="!isLoading">
      <t-alert v-if="!data.length" class="alert---bordered" :dismissible="false" show>
        No available data to show
      </t-alert>

      <div v-if="data.length" class="bg-white rounded w-full">
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
  </div>
</template>

<script>
import { keys } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'

export default {
  name      : 'metrics',
  components: {
    'b-button': BButton,
  },
  mixins: [PageDefaultMixin('metrics')],
  data  : () => ({
    clearDataOnDestroy: false,
  }),
  computed: {
    tableHeader () {
      return this.data ? keys(this.data[0]) : []
    },
  },
  methods: {
    openMetricStatsPage ({ processName }) {
      this.$router.push({ name: 'metrics/processName', params: { processName } })
    },
  },
}
</script>
