import { map, filter, assign } from 'lodash'

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
  PATCH_USER (state, newUserData) {
    state.users = map(state.users, (user) => {
      if (user._id !== newUserData._id) return user

      return assign({}, user, newUserData)
    })
  },
  REMOVE_USER (state, user) {
    state.users = filter(state.users, u => u._id !== user._id)
  },
  CLEAR_DATA (state) {
    state.users = null
  },
}

export const actions = {
  loadUsers (ctx) {
    return this.$axios.post('/api/auth/getUsers')
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
  editUser (ctx, newUserData) {
    return this.$axios.post('/api/auth/editUser', newUserData)
      .then((res) => {
        const { data } = res

        if (data && !data.error) {
          ctx.commit('PATCH_USER', newUserData)

          return ctx.state.users
        }

        throw data
      })
      .catch((err) => {
        throw err
      })
  },
  removeUser (ctx, user) {
    const data = { _id: user._id }

    return this.$axios.delete('/api/auth/removeUser', { data })
      .then((res) => {
        const { data } = res

        if (data && !data.error) {
          ctx.commit('REMOVE_USER', user)

          return ctx.state.users
        }

        throw data
      })
      .catch((err) => {
        throw err
      })
  },
}
