export default ({ store }, inject) => {
  const setPageTitle = (pageTitle = null) => {
    store.commit('SET_PAGE_TITLE', pageTitle)
  }

  inject('setPageTitle', setPageTitle)
}
