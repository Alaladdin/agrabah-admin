export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx, queryData) {
    ctx.commit('SET_REQUEST_ID', queryData.requestId)

    return this.$axios.post('/api/auth/getUsers', queryData.filters)
      .then((res) => {
        if (ctx.state.requestId === queryData.requestId) {
          ctx.commit('SET_DATA', res.data)

          return res.data
        }
      })
      .catch((err) => {
        if (ctx.state.requestId === queryData.requestId)
          throw err
      })
  },
  editUser (ctx, newUserData) {
    return ctx.dispatch('editUser', newUserData, { root: true })
      .then((userData) => {
        ctx.commit('PATCH_ITEM', userData)

        return userData
      })
      .catch((err) => {
        throw err
      })
  },
  removeUser (ctx, user) {
    const data = { _id: user._id }

    return this.$axios.delete('/api/auth/removeUser', { data })
      .then((res) => {
        ctx.commit('REMOVE_ITEM', user)

        return res.data
      })
      .catch((err) => {
        throw err
      })
  },
}
