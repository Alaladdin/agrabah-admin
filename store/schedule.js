export const state = () => ({
  data     : [],
  requestId: null,
})

export const getters = {
  getSchedule: state => state.data,
}

export const mutations = {
  SET_SCHEDULE (state, schedule) {
    state.data = schedule
  },
  SET_REQUEST_ID (state, requestId) {
    state.requestId = requestId
  },
  CLEAR_DATA (state) {
    state.data = []
    state.requestId = null
  },
}

export const actions = {
  loadSchedule (ctx, { start, finish, requestId }) {
    ctx.commit('SET_REQUEST_ID', requestId)

    return this.$axios.$get('/api/getSchedule', { params: { start, finish } })
      .then((data) => {
        if (ctx.state.requestId !== requestId) return
        if (!data) throw (data)

        ctx.commit('SET_SCHEDULE', data.schedule)

        return data.schedule
      })
      .catch((err) => {
        if (ctx.state.requestId === requestId) {
          ctx.commit('SET_SCHEDULE', [])
          throw err
        }
      })
  },
}
