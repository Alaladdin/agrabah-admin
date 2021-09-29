import vkChats from '@/data/chats'

export const state = () => ({
  vkChats,
  botConfig: null,
})

export const getters = {
  getVKChats  : state => state.vkChats,
  getBotConfig: state => state.botConfig,
}

export const mutations = {
  setBotConfig (state, botConfig) {
    state.botConfig = botConfig
  },
}

export const actions = {
  sendMessage (ctx, { message, chatId = vkChats[0].chatId, parseLinks = false }) {
    return this.$api.$post('/vk/sendMessage', { message, chatId, parseLinks })
  },
  getBotConfig (ctx) {
    return this.$api.$get('/vk/getStore')
      .then((data) => {
        ctx.commit('setBotConfig', data.store)

        return data.store
      })
      .catch((err) => {
        throw err
      })
  },
}
