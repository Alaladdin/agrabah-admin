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
  setUpdownStatus (state, newData) {
    state.updownStatus = newData
  },
  updateUpdownServices (state, updownStatus) {
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
  getUpdownStatus (ctx) {
    return this.$axios.$get('/api/getUpdownStatus')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('setUpdownStatus', data.updownStatus)
        ctx.commit('updateUpdownServices', data.updownStatus)

        return data.updownStatus
      })
      .catch((err) => {
        throw err
      })
  },
}
