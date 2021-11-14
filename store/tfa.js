import { map, filter, assign } from 'lodash'

export const state = () => ({
  tfas: null,
})

export const getters = {
  getTfas: state => state.tfas,
}

export const mutations = {
  SET_TFAS (state, tfas) {
    state.tfas = tfas
  },
  ADD_TFA (state, tfa) {
    state.tfas.push(tfa)
  },
  PATCH_TFA (state, newTfa) {
    state.tfas = map(state.tfas, (tfa) => {
      if (tfa._id !== newTfa._id) return tfa

      return assign({}, tfa, newTfa)
    })
  },
  REMOVE_TFA (state, tfa) {
    state.tfas = filter(state.tfas, i => i._id !== tfa._id)
  },
  CLEAR_DATA (state) {
    state.tfas = null
  },
}

export const actions = {
  loadTfas (ctx) {
    return this.$axios.get('/api/tfa/getTfas')
      .then((res) => {
        const { tfas } = res.data

        ctx.commit('SET_TFAS', tfas)

        return tfas
      })
      .catch((err) => {
        throw err
      })
  },
  addTfa (ctx, { name, secret }) {
    return this.$axios.post('/api/tfa/addTfa', { name, secret })
      .then((res) => {
        const { tfa } = res.data

        ctx.commit('ADD_TFA', tfa)

        return tfa
      })
      .catch((err) => {
        throw err
      })
  },
  editTfa (ctx, tfa) {
    return this.$axios.patch('/api/tfa/editTfa', tfa)
      .then((res) => {
        ctx.commit('PATCH_TFA', res.data)

        return res.data
      })
      .catch((err) => {
        throw err
      })
  },
  removeTfa (ctx, tfa) {
    return this.$axios.delete('/api/tfa/removeTfa', { data: tfa })
      .then((res) => {
        const { data } = res

        ctx.commit('REMOVE_TFA', tfa)

        return data
      })
      .catch((err) => {
        throw err
      })
  },
}
