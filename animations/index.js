import { assign } from 'lodash'

export const animateNumber = (...args) => {
  const defaultConfig = {
    textContent: [0, 100],
    round      : 1,
    duration   : 1000,
    easing     : 'easeInOutExpo',
  }

  return assign({}, defaultConfig, ...args)
}

export const pendulumY = (...args) => {
  const defaultConfig = {
    translateY: [0, 15],
    loop      : true,
    duration  : 1000,
    direction : 'alternate',
    easing    : 'easeInOutSine',
  }

  return assign({}, defaultConfig, ...args)
}

export const fadeIn = (...args) => {
  const defaultConfig = {
    opacity : [0, 1],
    duration: 600,
    delay   : 800,
    easing  : 'easeInOutQuad',
  }

  console.log(assign({}, defaultConfig, ...args))

  return assign({}, defaultConfig, ...args)
}

export const fadeInWithTranslateY = (...args) => {
  const defaultConfig = {
    opacity   : [0, 1],
    translateY: [50, 0],
    duration  : 600,
    easing    : 'easeInOutQuad',
  }

  return assign({}, defaultConfig, ...args)
}

export const animateBGColor = (...args) => {
  const defaultConfig = {
    backgroundColor: ['#fff', '#222'],
    duration       : 600,
    easing         : 'easeInOutQuad',
  }

  return assign({}, defaultConfig, ...args)
}
