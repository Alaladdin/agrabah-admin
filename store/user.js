export const state = () => ({
  user: null,
})

export const mutations = {
  SET_USER (state, data) {
    state.user = data
  },
  CLEAR_DATA (state) {
    state.user = null
  },
}

export const getters = {
  getUser: state => state.user,
}

export const actions = {
  loadUser (ctx, username) {
    return this.$axios.$post('/api/auth/getUsers', { username })
      .then((users) => {
        if (users.length) {
          ctx.commit('SET_USER', users[0])

          return users[0]
        }

        ctx.commit('SET_USER', false)
      })
      .catch((err) => {
        ctx.commit('SET_USER', false)

        throw err
      })
  },
  removeUser (ctx, user) {
    return this.$axios.$delete('/api/auth/removeUser', { data: { _id: user._id } })
  },
}
