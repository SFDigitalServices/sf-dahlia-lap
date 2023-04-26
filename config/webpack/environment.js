const { environment } = require('@rails/webpacker')
const dotenv = require('dotenv')
const webpack = require('webpack')

const dotenvFiles = ['.env']
dotenvFiles.forEach((dotenvFile) => {
  dotenv.config({ path: dotenvFile, silent: true })
})

environment.plugins.prepend(
  'Environment',
  new webpack.DefinePlugin({
    'process.env': { SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN) }
  })
)

module.exports = environment
