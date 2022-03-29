export default ({ route, store, redirect }) => {
  const user = store.getters.getUserData
  const { name: routeName } = route
  const isLoggedUserRestricted = user.loggedIn && routeName === 'login'
  const isNotLoggedUserRestricted = !user.loggedIn && ['user/username', 'logout'].includes(routeName)

  if (isLoggedUserRestricted || isNotLoggedUserRestricted)
    redirect({ name: 'index' })
}
