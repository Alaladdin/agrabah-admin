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
    return this.$axios.$get('/api/changes')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('SET_CHANGES', data.changes)

        return data.changes
      })
      .catch((err) => {
        throw err
      })
  },
}
