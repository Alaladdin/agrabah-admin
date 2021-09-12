require('dotenv').config()

module.exports = {
  apps: [
    {
      name          : 'admin',
      exec_mode     : 'cluster',
      script        : './node_modules/nuxt/bin/nuxt.js',
      args          : 'start',
      watch         : true,
      ignore_watch  : ['node_modules'],
      env           : { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      key          : process.env.DEPLOY_PUBLIC_KEY,
      user         : process.env.DEPLOY_USER,
      host         : [{ host: process.env.DEPLOY_HOST, port: process.env.DEPLOY_PORT }],
      ref          : 'origin/main',
      repo         : 'https://github.com/Alaladdin/mpei-admin-nuxt',
      path         : '$HOME/dev/mpei-admin',
      'post-deploy': 'pnpm install; pm2 restart ./ecosystem.config.js --env production',
    },
  },
}
