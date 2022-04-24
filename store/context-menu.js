export const state = () => ({
  buttons  : [],
  position : '',
  isVisible: false,
})

export const getters = {
  getButtons  : state => state.buttons,
  getPosition : state => state.position,
  getIsVisible: state => state.isVisible,
}

export const mutations = {
  SET_BUTTONS (state, buttons) {
    state.buttons = buttons
  },
  SET_POSITION (state, position) {
    state.position = position
  },
  SET_VISIBILITY (state, isVisible) {
    state.isVisible = isVisible
  },
}
