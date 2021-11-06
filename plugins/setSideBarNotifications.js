export default ({ store }, inject) => {
  const setSideBarNotifications = (key, value) => {
    store.commit('SET_SIDEBAR_NOTIFICATION', { key, value })
  }

  inject('setSideBarNotifications', setSideBarNotifications)
}
