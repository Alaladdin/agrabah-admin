const path = require('path')

module.exports = {
  resolve: {
    // for WebStorm
    alias: {
      '@'   : path.resolve(__dirname),
      assets: path.resolve(__dirname, './assets'),
    },
  },
}
