import { map, filter, assign } from 'lodash'

export const state = () => ({
  users    : null,
  requestId: null,
})

export const getters = {
  getUsers: state => state.users,
}

export const mutations = {
  SET_REQUEST_ID (state, requestId) {
    state.requestId = requestId
  },
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
    state.requestId = null
  },
}

export const actions = {
  loadUsers (ctx, { requestId, filters }) {
    ctx.commit('SET_REQUEST_ID', requestId)

    return this.$axios.post('/api/auth/getUsers', filters)
      .then((res) => {
        if (ctx.state.requestId !== requestId) return

        const { data } = res

        if (data && !data.error) {
          ctx.commit('SET_USERS', data)

          return data
        }

        throw data
      })
      .catch((err) => {
        if (ctx.state.requestId === requestId) throw err
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
