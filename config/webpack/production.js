const webpackConfig = require('./envSpecific')

const productionEnvOnly = (_clientWebpackConfig) => {
  // place any code here that is for production only
}

module.exports = webpackConfig(productionEnvOnly)
