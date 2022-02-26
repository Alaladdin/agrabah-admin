export default ({ route, store, redirect }) => {
  const { auth } = store.state
  const { path: routePath } = route
  const isLoggedUserRestricted = auth.loggedIn && routePath === '/login'
  const isNotLoggedUserRestricted = !auth.loggedIn && ['/me', '/logout'].includes(routePath)

  if (isLoggedUserRestricted || isNotLoggedUserRestricted)
    redirect({ name: 'index' })
}
