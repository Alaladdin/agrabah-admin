import vue from 'vue'
import { filter } from 'lodash'
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
        username   : 'guest',
        accessLevel: 'guest',
        loggedIn   : false,
        isGuest    : true,
      }
    }

    const { user, loggedIn } = state.auth

    user.isGuest = user.accessLevel === 'guest'
    user.isAdmin = ['owner', 'admin'].includes(user.accessLevel)
    user.isFullAccess = user.accessLevel === 'owner'

    return { ...user, loggedIn }
  },
}

export const mutations = {
  setAppVersion (state, data) {
    state.appVersion = data
  },
  patchNavbarNotifications (state, { key, value }) {
    vue.set(state.navbarNotifications, key, value)
  },
  pushError (state, error) {
    state.errors.push(error)
  },
  removeError (state, error) {
    state.errors = filter(state.errors, err => err !== error)
  },
}

export const actions = {
  loadAppVersion (ctx) {
    ctx.commit('setAppVersion', version)
  },
}
