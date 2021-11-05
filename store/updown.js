import { map, find } from 'lodash'
import { updownServices } from '@/data'

export const state = () => ({
  updownServices,
  updownStatus: null,
})

export const getters = {
  getUpdownServices: state => state.updownServices,
}

export const mutations = {
  SET_UPDOWN_STATUS (state, newData) {
    state.updownStatus = newData
  },
  UPDATE_UPDOWN_SERVICES (state, updownStatus) {
    state.updownServices = map(state.updownServices, (service) => {
      const status = find(updownStatus, s => service.url && s.url.includes(service.url))

      if (status) {
        const { down, last_status: lastStatus } = status

        service.isOnline = !down && lastStatus === 200
      }

      return service
    })
  },
}

export const actions = {
  loadUpdownStatus (ctx) {
    return this.$axios.$get('/api/getUpdownStatus')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('SET_UPDOWN_STATUS', data.updownStatus)
        ctx.commit('UPDATE_UPDOWN_SERVICES', data.updownStatus)

        return data.updownStatus
      })
      .catch((err) => {
        throw err
      })
  },
}
