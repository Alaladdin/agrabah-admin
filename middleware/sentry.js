import { pick } from 'lodash/object'

export default ({ store, $sentry }) => {
  const userFields = ['_id', 'username', 'scope', 'isAdmin', 'isOwner', 'loggedIn']
  const user = pick(store.getters.getUserData, userFields)

  $sentry?.setUser(user)
}
