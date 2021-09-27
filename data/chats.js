import config from '@/nuxt.config.js'

export default config.isDev
  ? {
      main          : 2000000003,
      spam          : 2000000003,
      trash         : 2000000003,
      trashSecondary: 2000000004,
      hateGera      : 2000000003,
    }
  : {
      main    : 2000000005,
      spam    : 2000000004,
      hateGera: 2000000012,
      trash   : 2000000003,
    }
