const isDev = process.env.NODE_ENV !== 'production'

export default isDev
  ? [
      { title: 'TRASH #1', chatId: 2000000003 },
      { title: 'TRASH #2', chatId: 2000000004 },
    ]
  : [
      { title: 'Main', chatId: 2000000005 },
      { title: 'SPAM', chatId: 2000000004 },
      { title: 'Hate Gera', chatId: 2000000012 },
      { title: 'TRASH (dev)', chatId: 2000000003 },
    ]
