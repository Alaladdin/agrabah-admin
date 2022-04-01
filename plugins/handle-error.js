import { parseError, generateSmallId } from '@/helpers'

export default ({ store, $sentry }, inject) => {
  const handleError = (error) => {
    $sentry.captureException(error)

    store.commit('PUSH_ERROR', {
      id  : generateSmallId(),
      text: parseError(error),
    })
  }

  inject('handleError', handleError)
}
