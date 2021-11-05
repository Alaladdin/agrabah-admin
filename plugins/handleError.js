import { parseError } from '@/helpers'

export default ({ store }, inject) => {
  const handleError = (error) => {
    store.commit('PUSH_ERROR', parseError(error))
  }

  inject('handleError', handleError)
}
