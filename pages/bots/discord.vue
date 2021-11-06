<template>
  <div>
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name    : 'Discord',
  computed: {
    ...mapGetters('discord', { botConfig: 'getBotConfig' }),

    botConfigFields () {
      if (!this.botConfig) return []

      const { actualityChannel, actualityTime, savedShortId } = this.botConfig

      return [
        { title: 'Channel ID', value: actualityChannel },
        { title: 'Time', value: actualityTime },
        { title: 'Last posted ID', value: savedShortId || 'none' },
      ]
    },
  },
  beforeDestroy () {
    this.$store.commit('discord/CLEAR_DATA')
  },
  mounted () {
    this.loadBotConfig()
      .catch(this.$handleError)
  },
  methods: {
    ...mapActions('discord', ['loadBotConfig']),
  },
}
</script>
