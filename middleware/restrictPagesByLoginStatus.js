export default ({ route, store, redirect }) => {
  const user = store.getters['user/getUserData']
  const { path: routePath } = route
  const isLoggedUserRestricted = user.loggedIn && routePath === '/login'
  const isNotLoggedUserRestricted = !user.loggedIn && ['/me', '/logout'].includes(routePath)

  if (isLoggedUserRestricted || isNotLoggedUserRestricted)
    redirect({ name: 'index' })
}
