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
  plugins: ['@/plugins/api'],
  css    : ['@/assets/scss/main.scss'],
  env    : {
    authToken: process.env.AUTH_TOKEN || '',
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
  axios : { proxy: true },
  router: {
    middleware       : ['auth', 'disallowAuth'],
    routeNameSplitter: '/',
  },
  auth: {
    strategies: {
      discord: {
        clientId           : process.env.DISCORD_CLIENT_ID,
        clientSecret       : process.env.DISCORD_CLIENT_SECRET,
        codeChallengeMethod: 'S256',
        grantType          : 'authorization_code',
        scope              : ['identify', 'guilds'],
        token              : {
          property: 'access_token',
          type    : 'Bearer',
          maxAge  : (60 * 60 * 24) * 14, // 14 days
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
