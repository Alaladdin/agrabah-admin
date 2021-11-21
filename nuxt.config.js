export default {
  head: {
    title: 'MPEI ADMIN',
    meta : [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'MPEI ADMIN SIDE' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css   : ['@/assets/scss/main.scss'],
  render: {
    asyncScripts: true,
  },
  plugins: [
    '~/plugins/vueTailwind',
    '~/plugins/handleError',
    '~/plugins/setSideBarNotifications',
  ],
  components  : true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    'nuxt-windicss',
    'nuxt-build-optimisations',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/yandex-metrika',
    '@nuxtjs/component-cache',
    '@nuxt/image',
    'nuxt-helmet',
    'nuxt-fontawesome',
    ['nuxt-tailvue', {
      toast: {
        defaultProps: {
          classToast  : 'v-toast bg-white',
          classMessage: 'whitespace-pre-line',
          timeout     : 3,
        },
      },
    }],
  ],
  image: {
    dir    : 'assets/img',
    presets: {
      default: {
        modifiers: {
          fit    : 'cover',
          format : 'webp',
          quality: 80,
        },
      },
    },
  },
  fontawesome: {
    component: 'fa',
    imports  : [
      { set: '@fortawesome/free-solid-svg-icons', icons: ['fas'] },
      { set: '@fortawesome/free-brands-svg-icons', icons: ['fab'] },
      { set: '@fortawesome/free-regular-svg-icons', icons: ['far'] },
    ],
  },
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': {
      target     : process.env.SERVER_ADDRESS,
      pathRewrite: { '^/api/': '/' },
      headers    : {
        AuthToken: process.env.AUTH_TOKEN,
      },
    },
  },
  router: {
    middleware       : ['restrictPagesByLoginStatus', 'restrictPagesByUserScope'],
    routeNameSplitter: '/',
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'user.token',
          type    : 'Bearer',
          global  : true,
          required: true,
        },
        user: {
          property : 'user',
          autoFetch: true,
        },
        endpoints: {
          user  : { url: '/api/auth/user', method: 'get' },
          login : { url: '/api/auth/login', method: 'post' },
          logout: false,
        },
      },
    },
  },
  loading: {
    color : '#4C4BE0',
    height: '5px',
  },
  yandexMetrika: {
    id      : process.env.YANDEX_METRICA_ID,
    webvisor: false,
    clickmap: false,
    useCDN  : true,
  },
}
