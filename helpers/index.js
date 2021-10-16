import { isString } from 'lodash'
import { nanoid } from 'nanoid'

const capitalize = string => string[0].toUpperCase() + string.slice(1)

const getAbbreviation = (string) => {
  const stringArray = string.split(' ')

  if (stringArray.length === 1) return string

  return stringArray.map(s => s[0]).join('').toUpperCase()
}

const parseError = (e) => {
  if (isString(e)) return e
  if (e.error) return e.error
  if (e.message) return e.message
  if (e.text) return e.text
  if (e.statusText) return `${e.status} ${e.statusText}`

  return 'Unexpected error'
}

const generateSmallId = (size = 6) => {
  return nanoid(size)
}

export {
  generateSmallId,
  parseError,
  capitalize,
  getAbbreviation
}
