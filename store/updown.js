import { map, find, assign } from 'lodash'
import { updownServices } from '@/data'

export const state = () => ({
  updownServices,
})

export const getters = {
  getUpdownServices: state => state.updownServices,
}

export const mutations = {
  UPDATE_UPDOWN_SERVICES (state, updownStatus) {
    state.updownServices = map(updownServices, (service) => {
      const status = find(updownStatus, s => service.url && s.url.includes(service.url))
      const isOnline = status ? !status.error : null

      return assign({}, service, { isOnline })
    })
  },
}

export const actions = {
  loadUpdownStatus (ctx) {
    return this.$axios.$get('/api/getUpdownStatus')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('UPDATE_UPDOWN_SERVICES', data.updownStatus)

        return data.updownStatus
      })
      .catch((err) => {
        throw err
      })
  },
}
