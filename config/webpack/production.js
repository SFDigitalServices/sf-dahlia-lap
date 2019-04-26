const environment = require('./environment')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

environment.plugins.prepend('SentryWebpack', new SentryWebpackPlugin({
  include: '.',
  ignoreFile: '.sentrycliignore',
  ignore: ['node_modules', 'webpack.config.js', 'spec', 'config', 'coverage'],
  configFile: 'sentry.properties'
}))

module.exports = environment.toWebpackConfig()
