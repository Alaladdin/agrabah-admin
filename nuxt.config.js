import concat from 'lodash/concat'

const isDev = process.env.NODE_ENV !== 'production'

export default {
  head: {
    title: 'AGRABAH ADMIN',
    meta : [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'AGRABAH ADMIN CONSOLE' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css   : ['@/assets/scss/main.scss'],
  render: {
    asyncScripts: true,
  },
  compressor: {
    level: 9,
  },
  plugins: [
    '~/plugins/axios',
    '~/plugins/socket.client',
    '~/plugins/v-tooltip',
    '~/plugins/v-tailwind',
    '~/plugins/v-toast',
    '~/plugins/handle-error',
    '~/plugins/set-sidebar-notification',
    '~/plugins/set-page-title',
  ],
  components: [
    { path: '~/components', pattern: '*.vue' },
    { path: '~/components', pattern: '**/*.js' },
  ],
  build: {
    loaders: {
      vue: {
        compiler: require('vue-template-babel-compiler'),
      },
    },
  },
  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/eslint-module',
    'nuxt-windicss',
    'nuxt-build-optimisations',
  ],
  modules: concat([
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/component-cache',
    '@nuxt/image',
    'nuxt-helmet',
    'nuxt-fontawesome',
  ], isDev ? [] : ['@nuxtjs/sentry']),
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
  },
  sentry: {
    dsn     : process.env.SENTRY_DSN,
    tracing : true,
    disabled: isDev,
  },
  image: {
    dir       : 'assets/img',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/agrabah/image/upload/',
    },
    presets: {
      default: {
        modifiers: {
          format : 'webp',
          quality: 80,
        },
      },
      avatar: {
        modifiers: {
          fit        : 'fill',
          format     : 'webp',
          roundCorner: 'max',
          quality    : 80,
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
      target     : process.env.API_ADDRESS,
      pathRewrite: { '^/api/': '/' },
      headers    : {
        AuthToken: process.env.AUTH_TOKEN,
      },
    },
    '/ws': {
      target: process.env.API_ADDRESS,
      ws    : true,
    },
  },
  router: {
    middleware       : concat(['restrictPagesByLoginStatus', 'restrictPagesByUserScope'], isDev ? [] : ['sentry']),
    routeNameSplitter: '/',
  },
  auth: {
    cookie: {
      options: {
        maxAge: 60 * 60 * 24 * 30,
        secure: !isDev,
      },
    },
    strategies: {
      local: {
        token: {
          property: 'user.token',
          maxAge  : 60 * 60 * 24 * 30,
        },
        user: {
          property : 'user',
          autoFetch: false,
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
  telemetry: false,
}
