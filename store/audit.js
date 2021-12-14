import { reverse } from 'lodash'
export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/getChanges')
      .then((data) => {
        const changes = reverse(data.changes)

        ctx.commit('SET_DATA', changes)
        this.$setSideBarNotifications('audit', changes.length)

        return changes
      })
      .catch((err) => {
        throw err
      })
  },
}
