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
  env: {
    authToken: process.env.AUTH_TOKEN,
    VKToken  : process.env.VK_TOKEN_DEV,
    DISToken : process.env.DIS_TOKEN,
  },
  plugins     : ['~/plugins/vue-tailwind'],
  components  : true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    'nuxt-windicss',
    '@aceforth/nuxt-optimized-images',
    'nuxt-build-optimisations',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/component-cache',
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
  fontawesome: {
    component: 'fa',
    imports  : [
      {
        set  : '@fortawesome/free-solid-svg-icons',
        icons: ['fas'],
      },
      {
        set  : '@fortawesome/free-brands-svg-icons',
        icons: ['fab'],
      },
    ],
  },
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': {
      target     : process.env.NODE_ENV !== 'production' ? 'http://localhost:9000' : 'https://api.mpei.space',
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
          global  : true,
          required: true,
          type    : 'Bearer',
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
  optimizedImages: {
    optimizeImages     : true,
    optimizeImagesInDev: true,
    optipng            : {
      optimizationLevel: 7,
    },
  },
}
