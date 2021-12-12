export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/dis/getStore')
      .then((data) => {
        ctx.commit('SET_DATA', data.store)

        return data.store
      })
      .catch((err) => {
        throw err
      })
  },
}
