import { isString } from 'lodash'
import { nanoid } from 'nanoid'
import { validateUsername, validatePassword } from './validators'

const generateSmallId = (size = 6) => {
  return nanoid(size)
}

const parseError = (e) => {
  if (isString(e)) return e
  if (e.error) return e.error
  if (e.message) return e.message
  if (e.text) return e.text
  if (e.statusText) return `${e.status} ${e.statusText}`

  return 'Unexpected error'
}

export {
  validateUsername,
  validatePassword,
  generateSmallId,
  parseError
}
