export const state = () => ({
  schedule: null,
})

export const getters = {
  getSchedule: state => state.schedule,
}

export const mutations = {
  set (state, schedule) {
    console.log(schedule)
    state.schedule = schedule
  },
}

export const actions = {
  loadSchedule (ctx) {
    return this.$api.$get('getSchedule')
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
