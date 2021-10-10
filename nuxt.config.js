export default {
  head: {
    title: 'MPEI ADMIN',
    meta : [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'MPEI ADMIN SIDE' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css  : ['@/assets/scss/main.scss'],
  isDev: process.env.NODE_ENV !== 'production',
  env  : {
    authToken: process.env.AUTH_TOKEN,
    VKToken  : process.env.VK_TOKEN_DEV,
    DISToken : process.env.DIS_TOKEN,
  },
  components  : true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    'nuxt-windicss',
    '@aceforth/nuxt-optimized-images',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-fontawesome',
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
      pathRewrite: { '^/api': '/' },
      headers    : {
        AuthToken: process.env.AUTH_TOKEN,
      },
    },
  },
  router: {
    middleware       : ['restrictPages'],
    routeNameSplitter: '/',
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global  : true,
          required: true,
          type    : 'Bearer',
        },
        user: {
          property : false,
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
