import { map, pick, reject, assign, omit } from 'lodash'

export const state = () => ({
  data     : null,
  actuality: null,
})

export const getters = {
  getData     : state => state.data,
  getActuality: state => state.actuality,
}

export const mutations = {
  SET_DATA (state, data) {
    state.data = data
  },
  ADD_ITEM (state, item) {
    state.data.push(item)
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
  ADD_ACTUALITY (state, newActuality) {
    state.data = map(state.data, (item) => {
      if (item._id === newActuality.sectionId) {
        const actualities = [...item.actualities, newActuality]

        return assign({}, item, { actualities })
      }

      return item
    })
  },
  REMOVE_ACTUALITY (state, actuality) {
    state.data = map(state.data, (item) => {
      if (item._id === actuality.sectionId) {
        const actualities = reject(item.actualities, { _id: actuality._id })

        return assign({}, item, { actualities })
      }

      return item
    })
  },
  PATCH_ACTUALITY (state, actuality) {
    state.data = map(state.data, (item) => {
      if (item._id === actuality.sectionId) {
        const actualities = map(item.actualities, (actualityItem) => {
          if (actualityItem._id !== actuality._id)
            return actualityItem

          return assign({}, actualityItem, actuality)
        })

        return assign({}, item, { actualities })
      }

      return item
    })
  },
  SET_ACTUALITY (state, actuality) {
    state.actuality = actuality
  },
  CLEAR_ACTUALITY (state) {
    state.actuality = null
  },
}

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/getActualitiesSections')
      .then((data) => {
        ctx.commit('SET_DATA', data.sections)

        return data.sections
      })
      .catch((err) => {
        throw err
      })
  },
  setSection (ctx, section) {
    return ctx.dispatch('setActualitySection', section)
      .then((data) => {
        ctx.commit('ADD_ITEM', data.section)

        return data.section
      })
      .catch((err) => {
        throw err
      })
  },
  editSection (ctx, section) {
    return ctx.dispatch('setActualitySection', section)
      .then((data) => {
        ctx.commit('PATCH_ITEM', data.section)

        return data.section
      })
      .catch((err) => {
        throw err
      })
  },
  setActualitySection (ctx, section) {
    const sectionData = pick(section, ['_id', 'name'])

    return this.$axios.$post('/api/setActualitySection', { section: sectionData }, { updateChanges: true })
  },
  removeSection (ctx, section) {
    const sectionData = { _id: section._id }

    return this.$axios.$delete('/api/removeActualitySection', { data: sectionData, updateChanges: true })
      .then((data) => {
        ctx.commit('REMOVE_ITEM', sectionData)

        return data
      })
      .catch((err) => {
        throw err
      })
  },
  getActuality (ctx, actualityId) {
    return this.$axios.$get('/api/getActuality', { params: { actualityId } })
      .then((data) => {
        ctx.commit('SET_ACTUALITY', data.actuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
  setActuality (ctx, actuality) {
    return ctx.dispatch('setActualityItem', actuality)
      .then((data) => {
        assign(actuality, data.actuality)

        actuality.sectionId
          ? ctx.commit('ADD_ACTUALITY', actuality)
          : ctx.commit('SET_ACTUALITY', actuality)

        return actuality
      })
      .catch((err) => {
        throw err
      })
  },
  editActuality (ctx, actuality) {
    return ctx.dispatch('setActualityItem', actuality)
      .then((data) => {
        const newActuality = assign(actuality, data.actuality)

        actuality.sectionId
          ? ctx.commit('PATCH_ACTUALITY', omit(newActuality, ['data', 'updatedBy']))
          : ctx.commit('SET_ACTUALITY', newActuality)

        return data.actuality
      })
      .catch((err) => {
        throw err
      })
  },
  setActualityItem (ctx, actuality) {
    const clearActuality = pick(actuality, ['_id', 'sectionId', 'name', 'data'])

    return this.$axios.$post('/api/setActuality', { actuality: clearActuality }, { updateChanges: true })
  },
  removeActuality (ctx, actuality) {
    const actualityData = pick(actuality, ['_id', 'sectionId'])

    return this.$axios.$delete('/api/removeActuality', { data: actualityData, updateChanges: true })
      .then((data) => {
        ctx.commit('REMOVE_ACTUALITY', actualityData)

        return data
      })
      .catch((err) => {
        throw err
      })
  },
}
