export default function ({ $axios, store, ...aaaaa }) {
  let needUpdateChanges = false

  $axios.onRequest((config) => {
    needUpdateChanges = !!config.updateChanges
  })

  $axios.onResponse(() => {
    if (needUpdateChanges) {
      store.dispatch('audit/init')
        .then((changes) => {
          store.$setSideBarNotifications('audit', changes.length)
        })
    }
  })

  $axios.onError((error) => {
    throw error?.response?.data || error
  })
}
