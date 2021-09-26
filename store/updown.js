import { map, find } from 'lodash'
import updownServices from '@/data/updownServices'

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
      const status = find(updownStatus, s => s.url === service.url)

      if (status) {
        const { down, alias, error, last_status: lastStatus } = status

        service.isOnline = !down && lastStatus === 200
        service.status = lastStatus
        service.error = error
        service.alias = alias
      }

      return service
    })
  },
}

export const actions = {
  getUpdownStatus (ctx) {
    return this.$api.$get('getUpdownStatus')
      .then((data) => {
        if (!data) throw (data)

        ctx.commit('setUpdownStatus', data.updownStatus)
        ctx.commit('updateUpdownServices', data.updownStatus)

        return data
      })
      .catch((err) => {
        throw err
      })
  },
}
