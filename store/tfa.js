export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.get('/api/tfa/getTfas')
      .then((res) => {
        const { tfas } = res.data

        ctx.commit('SET_DATA', tfas)

        return tfas
      })
      .catch((err) => {
        throw err
      })
  },
  addTfa (ctx, { name, secret }) {
    return this.$axios.post('/api/tfa/addTfa', { name, secret })
      .then((res) => {
        const { tfa } = res.data

        ctx.commit('ADD_ITEM', tfa)

        return tfa
      })
      .catch((err) => {
        throw err
      })
  },
  editTfa (ctx, tfa) {
    return this.$axios.patch('/api/tfa/editTfa', tfa)
      .then((res) => {
        ctx.commit('PATCH_ITEM', res.data)

        return res.data
      })
      .catch((err) => {
        throw err
      })
  },
  removeTfa (ctx, tfa) {
    return this.$axios.delete('/api/tfa/removeTfa', { data: tfa })
      .then((res) => {
        const { data } = res

        ctx.commit('REMOVE_ITEM', tfa)

        return data
      })
      .catch((err) => {
        throw err
      })
  },
}
