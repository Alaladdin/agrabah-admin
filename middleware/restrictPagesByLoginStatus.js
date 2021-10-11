export default ({ route, store, redirect }) => {
  const { auth } = store.state
  const isLoggedUserRestricted = auth.loggedIn && ['/login'].includes(route.path)
  const isNotLoggedUserRestricted = !auth.loggedIn && ['/profile', '/logout'].includes(route.path)

  if (isLoggedUserRestricted || isNotLoggedUserRestricted)
    redirect({ name: 'index' })
}
