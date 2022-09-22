import find from 'lodash/find'
import { navItems } from '@/data'

export default ({ route, store, redirect }) => {
  const currentUser = store.getters.getUserData
  const page = find(navItems, { name: route.name })

  if (page?.scope) {
    const hasAccess = currentUser?.scope.includes(page.scope)

    if (!hasAccess)
      redirect({ name: 'index' })
  }
}
