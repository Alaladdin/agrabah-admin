require('dotenv').config()

module.exports = {
  apps: [
    {
      name          : 'admin',
      exec_mode     : 'cluster',
      script        : './node_modules/nuxt/bin/nuxt.js',
      args          : 'start',
      env           : { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
  deploy: {
    production: {
      key          : process.env.DEPLOY_KEY,
      user         : process.env.DEPLOY_USER,
      host         : [{ host: process.env.DEPLOY_HOST, port: process.env.DEPLOY_PORT }],
      ref          : 'origin/main',
      repo         : 'https://github.com/Alaladdin/agrabah-admin',
      path         : process.env.DEPLOY_PATH,
      'pre-deploy' : 'pm2 stop ./ecosystem.config.js',
      'post-deploy': [
        'npm install --omit=dev',
        'npm run build',
        'pm2 start ./ecosystem.config.js --env production --update-env',
      ].join('; '),
    },
  },
}
