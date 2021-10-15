export const state = () => ({
  users: null,
})

export const getters = {
  getUsers: state => state.users,
}

export const mutations = {
  SET_USERS (state, users) {
    state.users = users
  },
  ADD_USER (state, user) {
    state.users.push(user)
  },
  CLEAR_DATA (state) {
    state.users = null
  },
}

export const actions = {
  loadUsers (ctx) {
    return this.$axios.get('/api/auth/getUsers')
      .then((res) => {
        const { data } = res

        if (data && !data.error) {
          ctx.commit('SET_USERS', data)

          return res.data
        }

        throw data
      })
      .catch((err) => {
        throw err
      })
  },
}
