export const state = () => ({
  data             : [],
  cancelTokenSource: null,
})

export const getters = {
  getSchedule: state => state.data,
}

export const mutations = {
  SET_SCHEDULE (state, schedule) {
    state.data = schedule
  },
  SET_CANCEL_TOKEN_SOURCE (state, cancelToken) {
    state.cancelTokenSource = cancelToken
  },
  CLEAR_DATA (state) {
    state.data = null
    state.cancelTokenSource = null
  },
}

export const actions = {
  cancelLoading (ctx) {
    const { cancelTokenSource } = ctx.state

    if (cancelTokenSource)
      cancelTokenSource.cancel()
  },
  loadSchedule (ctx, params) {
    const source = this.$axios.CancelToken.source()

    ctx.dispatch('cancelLoading')
    ctx.commit('SET_CANCEL_TOKEN_SOURCE', source)

    return this.$axios.$get('/api/getSchedule', { params, cancelToken: source.token, progress: false })
      .then((data) => {
        ctx.commit('SET_SCHEDULE', data.schedule)

        return data.schedule
      })
      .catch((err) => {
        if (!this.$axios.isCancel(err)) {
          ctx.commit('SET_SCHEDULE', [])
          throw err
        }
      })
  },
}
