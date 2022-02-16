import { find, some } from 'lodash'
import { navItems } from '@/data'

export default function ({ store, redirect, route }) {
  const { getUserData: user } = store.getters

  const page = find(navItems, { path: route.path })

  if (page && page.scope) {
    const hasAccess = some(page.scope, (navScope) => {
      return user.scope.includes(navScope)
    })

    if (!hasAccess) redirect({ name: 'index' })
  }
}
