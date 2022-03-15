export default ({ $axios, store, error: goToErrorPage }) => {
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
    const { response } = error

    if ($axios.isCancel(error))
      return

    if (response.status === 403)
      goToErrorPage({ statusCode: 403 })

    throw response.data || error
  })
}
