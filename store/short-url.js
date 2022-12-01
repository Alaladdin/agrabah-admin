export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/getUrls')
      .then((data) => {
        ctx.commit('SET_DATA', data.urls.reverse())

        return data.urls
      })
      .catch((err) => {
        throw err
      })
  },
  addUrl (ctx, url) {
    return this.$axios.$post('/api/addUrl', { url })
      .then((data) => {
        ctx.commit('ADD_ITEM_START', data.url)

        return data.url
      })
      .catch((err) => {
        throw err
      })
  },
  editUrl (ctx, url) {
    return this.$axios.$patch('/api/editUrl', { url })
      .then((data) => {
        ctx.commit('PATCH_ITEM', data.url)

        return data.url
      })
      .catch((err) => {
        throw err
      })
  },
  removeUrl (ctx, url) {
    ctx.commit('REMOVE_ITEM', url)

    return this.$axios.$delete('/api/removeUrl', { data: url })
      .catch((err) => {
        ctx.dispatch('init')

        throw err
      })
  },
}
