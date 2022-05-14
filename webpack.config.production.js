const devConfig = require('./webpack.config');

module.exports = {
  ...devConfig,
  mode: 'production',
  devtool: false
}