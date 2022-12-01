export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return ctx.dispatch('loadMail')
      .then((mail) => {
        ctx.commit('SET_DATA', mail)
      })
  },
  loadMoreMail (ctx, data) {
    return ctx.dispatch('loadMail', data)
      .then((mail) => {
        ctx.commit('ADD_ITEMS', mail)
      })
  },
  loadMail (ctx, data) {
    const requestConfig = { params: { offset: data?.offset } }

    return this.$axios.$get('/api/mail', requestConfig)
      .then(data => data.mail)
  },
  toggleRead (ctx, mail) {
    ctx.commit('PATCH_ITEM', mail)

    return this.$axios.$post('/api/mail/read', { mail }, { progress: false })
      .then(() => ctx.dispatch('clearMailCache'))
      .then(() => ctx.dispatch('init'))
      .catch((err) => {
        throw err
      })
  },
  clearMailCache () {
    return this.$axios.$delete('/api/mail', { progress: false })
  },
}
