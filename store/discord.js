export const state = () => ({
  botConfig: null,
})

export const getters = {
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
  getBotConfig (ctx) {
    return this.$axios.$get('/api/dis/getStore')
      .then((data) => {
        ctx.commit('SET_CONFIG', data.store)

        return data.store
      })
      .catch((err) => {
        throw err
      })
  },
}
