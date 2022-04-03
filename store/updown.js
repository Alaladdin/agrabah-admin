export const state = () => ({
  updownStatus: null,
})

export const getters = {
  getUpdownStatus: state => state.updownStatus,
}

export const mutations = {
  SET_UPDOWN_STATUS (state, updownStatus) {
    state.updownStatus = updownStatus
  },
}

export const actions = {
  loadUpdownStatus (ctx) {
    return this.$axios.$get('/api/getUpdownStatus')
      .then((data) => {
        ctx.commit('SET_UPDOWN_STATUS', data.updownStatus)

        return data.updownStatus
      })
      .catch((err) => {
        throw err
      })
  },
}
