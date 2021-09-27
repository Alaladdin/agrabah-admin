import vue from 'vue'
import { version } from '@/package.json'

export const state = () => ({
  appVersion         : null,
  navbarNotifications: {},
})

export const getters = {
  getAppVersion         : state => state.appVersion,
  getNavbarNotifications: state => state.navbarNotifications,
  getUserData           : (state) => {
    if (!state.auth.user) return null

    const { id: userId, avatar, banner } = state.auth.user
    const discordCDNUrl = 'https://cdn.discordapp.com'

    return {
      ...state.auth.user,
      avatarUrl: `${discordCDNUrl}/avatars/${userId}/${avatar}`,
      bannerUrl: `${discordCDNUrl}/banners/${userId}/${banner}`,
    }
  },
}

export const mutations = {
  setAppVersion (state, data) {
    state.appVersion = data
  },
  patchNavbarNotifications (state, { key, value }) {
    vue.set(state.navbarNotifications, key, value)
  },
}

export const actions = {
  loadAppVersion (ctx) {
    ctx.commit('setAppVersion', version)
  },
}
