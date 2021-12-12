import { pick } from 'lodash'

export const state = () => ({
  actuality: {},
})

export const getters = {
  getActuality: state => state.actuality,
}

export const mutations = {
  SET_ACTUALITY (state, actuality) {
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

        ctx.commit('SET_ACTUALITY', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
  setActuality (ctx, actuality) {
    const data = pick(actuality, ['content', 'lazyContent'])

    return this.$axios.$post('/api/setActuality', { actuality: data }, { updateChanges: true })
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
