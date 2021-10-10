export const state = () => ({
  actuality: null,
})

export const getters = {
  getActuality: state => state.actuality,
}

export const mutations = {
  set (state, actuality) {
    state.actuality = {
      ...actuality,
      content    : actuality.content || '',
      lazyContent: actuality.lazyContent || '',
    }
  },
}

export const actions = {
  loadActuality (ctx) {
    return this.$axios.$get('/api/getActuality')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('set', data.actuality)

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

        ctx.commit('set', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
}
