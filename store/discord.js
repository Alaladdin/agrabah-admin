export const state = () => ({
  teamUsers: null,
  botConfig: null,
})

export const getters = {
  getTeamUsers: state => state.teamUsers,
  getBotConfig: state => state.botConfig,
}

export const mutations = {
  setTeamUsers (state, users) {
    state.teamUsers = users
  },
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
  loadTeamUsers (ctx, usersIds) {
    return this.$api.$post('/dis/getUsers', { usersIds })
      .then((data) => {
        ctx.commit('setTeamUsers', data.users)

        return data.users
      })
      .catch((err) => {
        throw err
      })
  },
}
