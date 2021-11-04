import { vkChats } from '@/data'

export const state = () => ({
  vkChats,
  botConfig: null,
})

export const getters = {
  getVKChats  : state => state.vkChats,
  getBotConfig: state => state.botConfig,
}

export const mutations = {
  SET_CONFIG (state, botConfig) {
    state.botConfig = botConfig
  },
  CLEAR_DATA (state) {
    state.botConfig = null
  },
}

export const actions = {
  sendMessage (ctx, { message, chatId = vkChats[0].chatId, parseLinks = false }) {
    return this.$axios.$post('/api/vk/sendMessage', { message, chatId, parseLinks })
  },
  loadBotConfig (ctx) {
    return this.$axios.$get('/api/vk/getStore')
      .then((data) => {
        ctx.commit('SET_CONFIG', data.store)

        return data.store
      })
      .catch((err) => {
        throw err
      })
  },
}
