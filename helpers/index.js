import { isArray, isObject, isString } from 'lodash'
import { nanoid } from 'nanoid'
import moment from 'moment'
import { validateUsername, validateDisplayName, validatePassword } from './validators'

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

const isJson = (str) => {
  try {
    if (isString(str)) JSON.parse(str)
    if (isObject(str) && !isArray(str)) JSON.stringify(str)
  } catch (e) {
    return false
  }

  return true
}

const setToLocalStorage = (key, value) => {
  if (process.client)
    localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocalStorage = (key, defaultValue = {}) => {
  if (!process.client) return defaultValue

  let val = localStorage.getItem(key)

  val = val && isJson(val) && JSON.parse(val)

  return val || defaultValue
}

const getRandomInt = (min, max) => {
  const minRange = Math.ceil(min)
  const maxRange = Math.floor(max)

  return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange)
}

const formatDate = (date, format = 'DD.MM.YYYY') => {
  return moment(date).format(format)
}

export {
  getRandomInt,
  formatDate,
  setToLocalStorage,
  getFromLocalStorage,
  validateUsername,
  validateDisplayName,
  validatePassword,
  generateSmallId,
  parseError
}
