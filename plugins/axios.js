export default function ({ $axios, store, ...a }) {
  let needGetChanges = false

  $axios.onRequest((config) => {
    needGetChanges = !!config.updateChanges
  })

  $axios.onResponse(() => {
    if (needGetChanges)
      store.dispatch('audit/loadChanges')
  })
}
