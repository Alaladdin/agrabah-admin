import { parseError, generateSmallId } from '@/helpers'

export default ({ store }, inject) => {
  const handleError = (error) => {
    store.commit('PUSH_ERROR', {
      id  : generateSmallId(),
      text: parseError(error),
    })
  }

  inject('handleError', handleError)
}
