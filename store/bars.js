export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/bars/user')
      .then((data) => {
        ctx.commit('SET_DATA', data.barsUser)

        return data.barsUser
      })
      .catch((err) => {
        throw err
      })
  },
  setUser (ctx, user) {
    return this.$axios.$post('/api/bars/user', user)
      .then((data) => {
        ctx.commit('SET_DATA', data.barsUser)
        ctx.commit('PATCH_CURRENT_USER', data, { root: true })

        return data.barsUser
      })
      .catch((err) => {
        throw err
      })
  },
  refreshMarks () {
    return this.$axios.$post('/api/bars/user/refreshMarks')
      .catch((err) => {
        throw err
      })
  },
  removeUser (ctx) {
    return this.$axios.$delete('/api/bars/user')
      .then((data) => {
        ctx.commit('SET_DATA', null)
        ctx.commit('PATCH_CURRENT_USER', { barsUser: null }, { root: true })

        return data.barsUser
      })
      .catch((err) => {
        throw err
      })
  },
}
