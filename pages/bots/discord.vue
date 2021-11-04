<template>
  <div>
    <div v-if="botConfigFields.length">
      <h3 class="my-6 text-xl font-semibold text-center">Actuality autoposting config</h3>

      <div class="flex justify-center">
        <div class="bg-white rounded w-max">
          <div
            v-for="(field, index) in botConfigFields"
            :key="index"
            class="flex justify-between p-3 w-100 border-b-1 last:border-b-0"
          >
            <span>{{ field.title }}</span>
            <span>{{ field.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseError } from '@/helpers'

export default {
  name    : 'Discord',
  computed: {
    ...mapGetters('discord', { botConfig: 'getBotConfig' }),

    botConfigFields () {
      if (!this.botConfig) return []

      const { actualityChannel, actualityTime, savedShortId } = this.botConfig

      return [
        {
          title: 'Channel',
          value: actualityChannel,
        },
        {
          title: 'Time',
          value: actualityTime,
        },
        {
          title: 'Last posted Id',
          value: savedShortId || 'none',
        },
      ]
    },
  },
  beforeDestroy () {
    this.$store.commit('discord/CLEAR_DATA')
  },
  mounted () {
    this.loadBotConfig()
  },
  methods: {
    ...mapActions('discord', ['loadBotConfig']),

    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
