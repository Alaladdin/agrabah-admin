import { parseError, generateSmallId } from '@/helpers'

export default ({ store }, inject) => {
  const handleError = (error) => {
    const errorData = {
      id  : generateSmallId(),
      text: parseError(error),
    }

    store.commit('PUSH_ERROR', errorData)
  }

  inject('handleError', handleError)
}
