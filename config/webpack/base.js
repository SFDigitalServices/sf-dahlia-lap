const dotenv = require('dotenv')
const { generateWebpackConfig, merge } = require('shakapacker')
const webpack = require('webpack')

// const babel = require('./loaders/babel')
// const sass = require('./loaders/sass')

const dotenvFiles = ['.env']
dotenvFiles.forEach((dotenvFile) => {
  dotenv.config({ path: dotenvFile, silent: true })
})

const commonOptions = {
  resolve: {
    extensions: ['.css', '.js', '.scss']
  }
  // module: {
  //   rules: [sass, babel]
  // }
}

const generatedWebpackConfig = generateWebpackConfig()
// const scssConfigIndex = generatedWebpackConfig.module.rules.findIndex((config) =>
//   '.scss'.match(config.test)
// )
// generatedWebpackConfig.module.rules.splice(scssConfigIndex, 1)

generatedWebpackConfig.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': { SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN) }
  })
)

const base = () => merge({}, generatedWebpackConfig, commonOptions)

module.exports = base
