export const state = () => ({
  botConfig: null,
})

export const getters = {
  getBotConfig: state => state.botConfig,
}

export const mutations = {
  setBotConfig (state, botConfig) {
    state.botConfig = botConfig
  },
}

export const actions = {
  getBotConfig (ctx) {
    return this.$api.$get('/dis/getStore')
      .then((data) => {
        ctx.commit('setBotConfig', data.store)

        return data.store
      })
      .catch((err) => {
        throw err
      })
  },
}
