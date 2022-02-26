export * from '@/mixins/m-store-default'

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
}
