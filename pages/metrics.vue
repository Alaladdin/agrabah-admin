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
        <t-alert
          class="alert---bordered mb-7"
          :show="showCachedAlert"
          @hidden="onAlertClose('cached')"
        >
          Results are cached for 30 mins
        </t-alert>

        <t-table :headers="tableHeader" :data="data">
          <template #column="{ text, columnIndex, tdClass }">
            <td :class="tdClass">
              <b-progress-bar v-if="columnIndex === 'cpu'" class="inline-flex" :value="text" reverse-colors />
              <div v-else :class="{ 'inline-flex badge badge--indigo' : columnIndex === 'version' }">
                {{ text }}
              </div>
            </td>
          </template>
        </t-table>
      </template>
    </template>
  </div>
</template>

<script>
import { keys } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'
import { setToLocalStorage, getFromLocalStorage } from '@/helpers'
import BProgressBar from '@/components/b-progress-bar'

export default {
  name      : 'metrics',
  components: {
    'b-progress-bar': BProgressBar,
  },
  mixins: [PageDefaultMixin('metrics')],
  data  : () => ({
    showCachedAlert: true,
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
