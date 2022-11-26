import { cloneDeep, map, isArray, isObject, isString, random, isNull } from 'lodash'
import { nanoid } from 'nanoid'
import moment from 'moment'
import { validateUsername, validateDisplayName, validatePassword, validateUrl } from './validators'

const clone = (...args) => cloneDeep(...args)
const getRandomNumber = (...args) => random(...args)
const generateSmallId = (size = 6) => nanoid(size)

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

  if (isJson(val))
    val = JSON.parse(val)

  return isNull(val) ? defaultValue : val
}

const formatDate = (date, format = 'DD.MM.YYYY') => moment(date).format(format)
const formatDateCalendar = (date, format = 'DD.MM.YYYY') => moment(date).calendar({
  lastWeek: 'MMM DD',
  lastDay : '[Yesterday]',
  sameDay : 'LT',
  nextDay : '[Tomorrow]',
  nextWeek: 'MMM DD',
  sameElse: 'DD.MM.YY',
})

const getOptionsFromFlatArray = options => map(options, option => ({ title: option, value: option }))

export {
  clone,
  getOptionsFromFlatArray,
  getRandomNumber,
  formatDate,
  formatDateCalendar,
  setToLocalStorage,
  getFromLocalStorage,
  validateUsername,
  validateDisplayName,
  validatePassword,
  validateUrl,
  generateSmallId,
  parseError
}
