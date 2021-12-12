export const state = () => ({
  changes: null,
})

export const getters = {
  getChanges: state => state.changes,
}

export const mutations = {
  CLEAR_DATA (state) {
    state.changes = null
  },
  SET_CHANGES (state, changes) {
    state.changes = changes
  },
}

export const actions = {
  loadChanges (ctx) {
    return this.$axios.$get('/api/getChanges')
      .then((data) => {
        const { changes } = data

        ctx.commit('SET_CHANGES', changes)
        this.$setSideBarNotifications('audit', changes.length)

        return changes
      })
      .catch((err) => {
        throw err
      })
  },
}
