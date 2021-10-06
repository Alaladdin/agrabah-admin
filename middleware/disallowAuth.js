import { map } from 'lodash'
import { usersWhiteMap } from '@/data'

export default ({ store, error }) => {
  const { auth } = store.state
  const usersWhiteList = map(usersWhiteMap, user => user.id)

  if (auth.loggedIn && !usersWhiteList.includes(auth.user.id))
    error({ statusCode: 403, message: 'Have no access' })
}
