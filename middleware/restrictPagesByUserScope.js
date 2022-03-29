import { find, map } from 'lodash'
import { navItems } from '@/data'

export default ({ route, store, redirect }) => {
  const user = store.getters.getUserData
  const page = find(navItems, (item) => {
    if (item.children) {
      const childrenRoutes = map(item.children, 'name')

      return childrenRoutes.includes(route.name)
    }

    return item.name === route.name
  })

  if (page && page.scope) {
    const hasAccess = user.scope.includes(page.scope)

    if (!hasAccess)
      redirect({ name: 'index' })
  }
}
