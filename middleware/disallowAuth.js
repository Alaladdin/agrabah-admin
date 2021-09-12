export default ({ store, error }) => {
  const { auth } = store.state
  const usersWhiteMap = {
    aladdin: '286937566693818368',
    abuh   : '775370044582526976',
    omar   : '366635960848482304',
    drobot : '295947226147192833',
  }
  const usersWhiteList = Object.values(usersWhiteMap)

  if (auth.loggedIn && !usersWhiteList.includes(auth.user.id))
    error({ statusCode: 403, message: 'Have no access' })
}
