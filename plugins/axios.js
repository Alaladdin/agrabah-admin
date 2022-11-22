export default ({ app, $axios, store, error: goToErrorPage }) => {
  let needUpdateChanges = false

  $axios.onRequest((config) => {
    needUpdateChanges = !!config.updateChanges
  })

  $axios.onResponse(() => {
    if (needUpdateChanges) {
      store.dispatch('audit/init')
        .then((changes) => {
          store.$setSideBarNotifications('audit', changes)
        })
    }
  })

  $axios.onError((error) => {
    const { response } = error

    if ($axios.isCancel(error))
      return

    if (response.status === 401)
      app.$auth.logout()

    if (response.status === 403)
      goToErrorPage({ statusCode: 403 })

    throw response.data || error
  })
}
