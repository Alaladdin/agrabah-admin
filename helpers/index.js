// const getRandomInt = ({ min = 0, max = 1 }) => {
//   const minRange = Math.ceil(min);
//   const maxRange = Math.floor(max);
//
//   return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange);
// };

// const getRandomArrayItem = (arr) => arr[getRandomInt({ max: arr.length - 1 })];

const capitalize = string => string[0].toUpperCase() + string.slice(1)

export { capitalize }
