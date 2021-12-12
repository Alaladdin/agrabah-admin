<template>
  <div v-if="botConfigFields.length">
    <h3 class="my-6 text-xl font-semibold text-center">Actuality autoposting config</h3>

    <div class="flex justify-center">
      <div class="bg-white rounded w-max">
        <div v-for="(field, index) in botConfigFields" :key="index" class="options">
          <span>{{ field.title }}</span>
          <span class="options__item">{{ field.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseExpression } from 'cron-parser'
import { formatDate } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name    : 'Discord',
  mixins  : [PageDefaultMixin('discord')],
  computed: {
    botConfigFields () {
      if (!this.data) return []

      const { actualityChannel, actualityTime, savedShortId } = this.data

      return [
        { title: 'Channel ID', value: actualityChannel || 'none' },
        { title: 'Next publish', value: this.getParsedCronDate(actualityTime) },
        { title: 'Last posted ID', value: savedShortId || 'none' },
      ]
    },
  },
  methods: {
    getParsedCronDate (cronExpression) {
      const cronDate = parseExpression(cronExpression).next().toString()

      return formatDate(cronDate, 'DD.MM HH:mm:ss')
    },
  },
}
</script>
