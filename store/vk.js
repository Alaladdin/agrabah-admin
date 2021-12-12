export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/vk/getStore')
      .then((data) => {
        ctx.commit('SET_DATA', data.store)

        return data.store
      })
      .catch((err) => {
        throw err
      })
  },
  sendMessage (ctx, { message, chatId, parseLinks = false }) {
    return this.$axios.$post('/api/vk/sendMessage', { message, chatId, parseLinks })
  },
}
