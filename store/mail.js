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
      .then((data) => {
        ctx.commit('PATCH_ITEM', data.mail)

        return data.mail
      })
      .catch((err) => {
        throw err
      })
  },
  refreshMail () {
    return this.$axios.$post('/api/mail/refresh')
      .catch((err) => {
        throw err
      })
  },
}
