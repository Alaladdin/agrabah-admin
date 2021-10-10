const restrictedPages = {
  loggedIn   : ['/login'],
  notLoggedIn: ['/profile', '/logout'],
}

export default ({ route, store, redirect }) => {
  const { auth } = store.state
  const isLoggedUserRestricted = auth.loggedIn && restrictedPages.loggedIn.includes(route.path)
  const isNotLoggedUserRestricted = !auth.loggedIn && restrictedPages.notLoggedIn.includes(route.path)

  if (isLoggedUserRestricted || isNotLoggedUserRestricted)
    redirect({ name: 'index' })
}
