export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$post('/api/auth/getUsers')
      .then((users) => {
        ctx.commit('SET_DATA', users)

        return users
      })
      .catch((err) => {
        ctx.commit('SET_DATA', false)

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
    return this.dispatch('user/removeUser', user)
      .then((res) => {
        ctx.commit('REMOVE_ITEM', user)

        return res
      })
      .catch((err) => {
        throw err
      })
  },
}
