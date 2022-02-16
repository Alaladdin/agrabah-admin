<template>
  <div>
    <t-alert v-if="isLoading" class="alert---bordered" :dismissible="false" show>
      Loading...
    </t-alert>

    <t-table
      v-if="!isLoading"
      :headers="tableHeader"
      :data="data"
    />
  </div>
</template>

<script>
import { keys } from 'lodash'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name  : 'metrics',
  mixins: [PageDefaultMixin('metrics')],
  computed: {
    tableHeader () {
      return this.data ? keys(this.data[0]) : []
    },
  },
}
</script>
