export const state = () => ({
  schedule: null,
})

export const getters = {
  getSchedule: state => state.schedule,
}

export const mutations = {
  set (state, schedule) {
    state.schedule = schedule
  },
}

export const actions = {
  loadSchedule (ctx, { start, finish }) {
    return this.$axios.$get('/api/getSchedule', { params: { start, finish } })
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('set', data.schedule)

        return data.schedule
      })
      .catch((err) => {
        ctx.commit('set', null)
        throw err
      })
  },
}
