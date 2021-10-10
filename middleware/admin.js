import { find, some } from 'lodash'
import { navItems } from '@/data'

export default function ({ store, redirect, route }) {
  const { getUserData: user } = store.getters

  const page = find(navItems, item => item.path === route.path)

  if (page.scope) {
    const hasAccess = some(page.scope, (navScope) => {
      return user.scope.includes(navScope)
    })

    if (!hasAccess) return redirect('/')
  }
}
