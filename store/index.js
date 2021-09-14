import { version } from '@/package.json'

export const state = () => ({
  appVersion: null,
})

export const getters = {
  getAppVersion: state => state.appVersion,
}

export const mutations = {
  setAppVersion (state, data) {
    state.appVersion = data
  },
}

export const actions = {
  loadAppVersion (ctx) {
    ctx.commit('setAppVersion', version)
  },
}
