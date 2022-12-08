import { reverse } from 'lodash'
export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/changes')
      .then((data) => {
        const changes = reverse(data.changes)

        ctx.commit('SET_DATA', changes)

        return changes
      })
      .catch((err) => {
        throw err
      })
  },
  clearChanges (ctx) {
    return this.$axios.$delete('/api/changes')
      .then(() => {
        ctx.commit('SET_DATA', [])

        return []
      })
      .catch((err) => {
        throw err
      })
  },
}
