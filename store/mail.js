export * from '@/mixins/m-store-default'

export const actions = {
  init (ctx) {
    return this.$axios.$get('/api/mail')
      .then((data) => {
        ctx.commit('SET_DATA', data.mail)

        return data.mail
      })
      .catch((err) => {
        throw err
      })
  },
  setMail (ctx, mail) {
    ctx.commit('PATCH_ITEM', mail)

    return this.$axios.$patch('/api/mail', mail, { progress: false })
      .then(data => data.mail)
      .catch((err) => {
        throw err
      })
  },
  clearMailCache () {
    return this.$axios({
      url     : '/api/mail',
      method  : 'PURGE',
      progress: false,
    })
  },
}
