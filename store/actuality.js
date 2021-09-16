import moment from 'moment'

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
      date: moment(actuality.date).format('DD.MM HH:mm'),
    }
  },
}

export const actions = {
  loadActuality (ctx) {
    return this.$api.$get('getActuality')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('set', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        ctx.commit('set', null)
        throw err
      })
  },
  setActuality (ctx, { content, lazyContent }) {
    const actuality = {
      content    : content || null,
      lazyContent: lazyContent || null,
    }

    return this.$api.$post('setActuality', { actuality })
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('set', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        ctx.commit('set', null)
        throw err
      })
  },
}
