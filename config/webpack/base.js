const dotenv = require('dotenv')
const { generateWebpackConfig, merge } = require('shakapacker')
const webpack = require('webpack')

const dotenvFiles = ['.env']
dotenvFiles.forEach((dotenvFile) => {
  dotenv.config({ path: dotenvFile, silent: true })
})

const commonOptions = {
  resolve: {
    extensions: ['.css', '.js', '.scss']
  }
}

const generatedWebpackConfig = generateWebpackConfig()

generatedWebpackConfig.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': {
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      UNLEASH_URL: JSON.stringify(process.env.UNLEASH_URL),
      UNLEASH_TOKEN: JSON.stringify(process.env.UNLEASH_TOKEN),
      UNLEASH_ENV: JSON.stringify(process.env.UNLEASH_ENV)
    }
  })
)

const base = () => merge({}, generatedWebpackConfig, commonOptions)

module.exports = base
