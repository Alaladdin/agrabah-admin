import { assign, map, reject } from 'lodash'

export const state = () => ({
  data     : null,
  requestId: null,
})

export const getters = {
  getData: state => state.data,
}

export const mutations = {
  SET_REQUEST_ID (state, requestId) {
    state.requestId = requestId
  },
  SET_DATA (state, data) {
    state.data = data
  },
  ADD_ITEM (state, data) {
    state.data.push(data)
  },
  ADD_ITEM_BEGIN (state, data) {
    state.data.unshift(data)
  },
  PATCH_ITEM (state, newItem) {
    state.data = map(state.data, (item) => {
      if (item._id !== newItem._id)
        return item

      return assign({}, item, newItem)
    })
  },
  REMOVE_ITEM (state, item) {
    state.data = reject(state.data, { _id: item._id })
  },
  CLEAR_DATA (state) {
    state.data = null
    state.requestId = null
  },
}
