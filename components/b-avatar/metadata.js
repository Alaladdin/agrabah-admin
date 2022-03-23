const defaultSize = 16

export default {
  avatarSizes: {
    extraSmall: defaultSize * 2.5,
    small     : defaultSize * 3,
    medium    : defaultSize * 4,
    large     : defaultSize * 6,
    extraLarge: defaultSize * 10,
  },
  avatarClassBySize: {
    extraSmall: ['ring-3'],
    small     : ['ring-4'],
    medium    : ['ring-4'],
    large     : ['ring-5'],
    extraLarge: ['ring-8'],
  },
}
