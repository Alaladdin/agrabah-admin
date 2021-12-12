import { pick } from 'lodash'
import * as StoreDefaultMixin from '@/mixins/m-store-default'

export const state = () => StoreDefaultMixin.state()
export const getters = StoreDefaultMixin.getters

export const mutations = {
  ...StoreDefaultMixin.mutations,

  SET_DATA (state, data) {
    state.data = {
      ...data,
      content    : data.content || '',
      lazyContent: data.lazyContent || '',
    }
  },
}

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/getActuality')
      .then((data) => {
        ctx.commit('SET_DATA', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
  updateData (ctx, data) {
    const actuality = pick(data, ['content', 'lazyContent'])

    return this.$axios.$post('/api/setActuality', { actuality }, { updateChanges: true })
      .then((data) => {
        ctx.commit('SET_DATA', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
}
