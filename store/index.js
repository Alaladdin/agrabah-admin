import vue from 'vue'
import { assign, reject } from 'lodash'
import { version } from '@/package.json'

export const state = () => ({
  appVersion         : null,
  navbarNotifications: {},
  errors             : [],
})

export const getters = {
  getAppVersion         : state => state.appVersion,
  getNavbarNotifications: state => state.navbarNotifications,
  getErrors             : state => state.errors,
  getUserData           : (state) => {
    if (!state.auth.user) {
      return {
        username: 'guest',
        scope   : ['guest'],
        loggedIn: false,
      }
    }

    const { user, loggedIn } = state.auth

    return {
      ...user,
      isAdmin: (user.scope.includes('admin') || user.scope.includes('owner')),
      isOwner: user.scope.includes('owner'),
      loggedIn,
    }
  },
}

export const mutations = {
  PATCH_CURRENT_USER (state, data) {
    state.auth.user = assign({}, state.auth.user, data)
  },
  SET_APP_VERSION (state, data) {
    state.appVersion = data
  },
  SET_SIDEBAR_NOTIFICATION (state, { key, value }) {
    vue.set(state.navbarNotifications, key, value)
  },
  PUSH_ERROR (state, error) {
    state.errors.push(error)
  },
  REMOVE_ERROR (state, error) {
    state.errors = reject(state.errors, { id: error.id })
  },
}

export const actions = {
  loadAppVersion (ctx) {
    ctx.commit('SET_APP_VERSION', version)
  },
  editUser (ctx, newUserData) {
    return this.$axios.$patch('/api/auth/editUser', newUserData)
      .then((user) => {
        const currentUserId = ctx.state.auth.user._id

        if (user._id === currentUserId)
          ctx.commit('PATCH_CURRENT_USER', user)

        return user
      })
      .catch((err) => {
        throw err
      })
  },
}
