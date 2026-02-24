const { inliningCss } = require('shakapacker')

const webpackConfig = require('./envSpecific')

const developmentEnvOnly = (clientWebpackConfig) => {
  // plugins
  if (inliningCss) {
    // Note, when this is run, we're building the server and client bundles in separate processes.
    // Thus, this plugin is not applied.
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
    clientWebpackConfig.plugins.push(
      new ReactRefreshWebpackPlugin()
    )
  }
}
module.exports = webpackConfig(developmentEnvOnly)
