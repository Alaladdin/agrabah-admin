// const getRandomInt = ({ min = 0, max = 1 }) => {
//   const minRange = Math.ceil(min);
//   const maxRange = Math.floor(max);
//
//   return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange);
// };

// const getRandomArrayItem = (arr) => arr[getRandomInt({ max: arr.length - 1 })];

const capitalize = string => string[0].toUpperCase() + string.slice(1)

const getAbbreviation = (string) => {
  const stringArray = string.split(' ')

  if (stringArray.length === 1) return string

  return stringArray.map(s => s[0]).join('').toUpperCase()
}

const parseError = (e) => {
  if (e.text) return e.text
  if (e.error) return e.error
  if (e.message) return e.message
  if (e.statusText) return `${e.status} ${e.statusText}`

  return 'Unexpected error'
}

export {
  parseError,
  capitalize,
  getAbbreviation
}
