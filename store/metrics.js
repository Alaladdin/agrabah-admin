import * as StoreDefaultMixin from '@/mixins/m-store-default'

export const state = () => ({
  ...StoreDefaultMixin.state(),

  stats: null,
})

export const getters = {
  ...StoreDefaultMixin.getters,

  getStats: state => state.stats,
}

export const mutations = {
  ...StoreDefaultMixin.mutations,

  SET_STATS (state, stats) {
    state.stats = stats
  },
  CLEAR_STATS (state) {
    state.stats = null
  },
}

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/getMetrics')
      .then((res) => {
        ctx.commit('SET_DATA', res.metrics)

        return res.metrics
      })
      .catch((err) => {
        throw err
      })
  },
  loadStats (ctx, { processName, period }) {
    return this.$axios.$get('/api/getStats', { params: { processName, period } })
      .then((res) => {
        ctx.commit('SET_STATS', res.stats)

        return res.stats
      })
      .catch((err) => {
        throw err
      })
  },
}
