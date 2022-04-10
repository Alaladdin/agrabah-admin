import { assign } from 'lodash/object'
import { map } from 'lodash'
import * as StoreDefaultMixin from '@/mixins/m-store-default'

export const state = () => ({
  ...StoreDefaultMixin.state(),

  stats        : null,
  currentPeriod: null,
})

export const getters = {
  ...StoreDefaultMixin.getters,

  getStats : state => state.stats,
  getPeriod: state => state.currentPeriod,
}

export const mutations = {
  ...StoreDefaultMixin.mutations,

  SET_STATS (state, stats) {
    state.stats = stats
  },
  PATCH_STATS (state, newStats) {
    state.stats = assign({}, state.stats, newStats)
  },
  PATCH_ITEM (state, newItem) {
    state.data = map(state.data, (item) => {
      if (item.processName !== newItem.processName)
        return item

      return assign({}, item, newItem)
    })
  },
  SET_PERIOD (state, period) {
    state.currentPeriod = period
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
        ctx.commit('SET_DATA', [])

        throw err
      })
  },
  loadStats (ctx, { processName, start, finish }) {
    return this.$axios.$get('/api/getStats', { params: { processName, start, finish } })
      .then((res) => {
        ctx.commit('SET_STATS', res.stats)

        return res.stats
      })
      .catch((err) => {
        ctx.commit('SET_STATS', {})

        throw err
      })
  },
  setProcessStatus (ctx, { processName, enable }) {
    return this.$axios.$post('/api/setProcessStatus', { processName, enable }, { updateChanges: true })
      .then((res) => {
        ctx.commit('PATCH_STATS', { isOnline: enable })
        ctx.commit('PATCH_ITEM', { processName, isOnline: enable })

        return res.result
      })
  },
}
