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
      key          : process.env.DEPLOY_KEY,
      user         : process.env.DEPLOY_USER,
      host         : [{ host: process.env.DEPLOY_HOST, port: process.env.DEPLOY_PORT }],
      ref          : 'origin/main',
      repo         : 'https://github.com/Alaladdin/mpei-admin-nuxt',
      path         : process.env.DEPLOY_PATH,
      'pre-deploy' : 'pm2 stop ./ecosystem.config.js',
      'post-deploy': 'npm install; npm run build && pm2 start ./ecosystem.config.js --env production --update-env',
    },
  },
}
