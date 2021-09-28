import config from '@/nuxt.config.js'

export default config.isDev
  ? [
      { title: 'TRASH #1', chatId: 2000000003 },
      { title: 'TRASH #2', chatId: 2000000004 },
    ]
  : [
      { title: 'Основная', chatId: 2000000005 },
      { title: 'SPAM', chatId: 2000000004 },
      { title: 'Хейт Геры', chatId: 2000000012 },
      { title: 'TRASH (dev)', chatId: 2000000003 },
    ]
