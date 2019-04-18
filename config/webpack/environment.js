const { environment } = require('@rails/webpacker')
const webpack = require('webpack')
const dotenv = require('dotenv')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const dotenvFiles = [
  '.env'
]
dotenvFiles.forEach((dotenvFile) => {
  dotenv.config({ path: dotenvFile, silent: true })
})

environment.plugins.prepend('Environment', new webpack.DefinePlugin({'process.env': {'SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN)}}))
environment.plugins.prepend('SentryWebpack', new SentryWebpackPlugin({
  include: '.',
  ignoreFile: '.sentrycliignore',
  ignore: ['node_modules', 'webpack.config.js', 'spec', 'config', 'coverage'],
  configFile: 'sentry.properties'
}))

module.exports = environment
