import usersWhiteMap from '../data/usersWhiteMap'

export default ({ store, error }) => {
  const { auth } = store.state
  const usersWhiteList = Object.values(usersWhiteMap)

  if (auth.loggedIn && !usersWhiteList.includes(auth.user.id))
    error({ statusCode: 403, message: 'Have no access' })
}
