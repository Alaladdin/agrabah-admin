export const state = () => ({
  data: null,
})

export const getters = {
  getActuality: state => state.data,
}

export const mutations = {
  SET_ACTUALITY (state, actuality) {
    state.data = {
      ...actuality,
      content    : actuality.content || '',
      lazyContent: actuality.lazyContent || '',
    }
  },
  CLEAR_DATA (state) {
    state.data = null
  },
}

export const actions = {
  loadActuality (ctx) {
    return this.$axios.$get('/api/getActuality')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('SET_ACTUALITY', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
  setActuality (ctx, { content, lazyContent }) {
    const actuality = { content, lazyContent }

    return this.$axios.$post('/api/setActuality', { actuality })
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('SET_ACTUALITY', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
}
