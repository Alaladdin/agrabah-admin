export const state = () => ({
  updownServices: null,
})

export const getters = {
  getUpdownServices: state => state.updownServices,
}

export const mutations = {
  UPDATE_UPDOWN_SERVICES (state, updownStatus) {
    state.updownServices = updownStatus
  },
}

export const actions = {
  loadUpdownStatus (ctx) {
    return this.$axios.$get('/api/getUpdownStatus')
      .then((data) => {
        ctx.commit('UPDATE_UPDOWN_SERVICES', data.updownStatus)

        return data.updownStatus
      })
      .catch((err) => {
        throw err
      })
  },
}
