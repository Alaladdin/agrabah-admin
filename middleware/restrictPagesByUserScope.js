import { find, map } from 'lodash'
import { navItems } from '@/data'

export default ({ route, store, redirect }) => {
  const { getUserData: user } = store.getters
  const page = find(navItems, (item) => {
    if (item.children) {
      const childrenRoutes = map(item.children, 'path')

      return childrenRoutes.includes(route.path)
    }

    return item.path === route.path
  })

  if (page && page.scope) {
    const hasAccess = user.scope.includes(page.scope)

    if (!hasAccess)
      redirect({ name: 'index' })
  }
}
