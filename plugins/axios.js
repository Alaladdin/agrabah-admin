export default function ({ $axios, store }) {
  let needGetChanges = false

  $axios.onRequest((config) => {
    needGetChanges = !!config.updateChanges
  })

  $axios.onResponse(() => {
    if (needGetChanges)
      store.dispatch('audit/init')
  })

  $axios.onError((error) => {
    throw error?.response?.data || error
  })
}
