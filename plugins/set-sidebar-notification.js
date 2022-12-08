import { findIndex, isNumber } from 'lodash'
import { getFromLocalStorage } from '@/helpers'

export default ({ store }, inject) => {
  const setSideBarNotifications = (key, value) => {
    let rewrittenValue = null

    if (key === 'index') {
      const lastViewedChangeId = getFromLocalStorage('last_viewed_change_id')
      const lastViewedChangeIndex = findIndex(value, { _id: lastViewedChangeId })

      if (lastViewedChangeIndex === -1)
        rewrittenValue = value.length
      else
        rewrittenValue = lastViewedChangeIndex
    }

    store.commit('SET_SIDEBAR_NOTIFICATION', { key, value: isNumber(rewrittenValue) ? rewrittenValue : value })
  }

  inject('setSideBarNotifications', setSideBarNotifications)
}
