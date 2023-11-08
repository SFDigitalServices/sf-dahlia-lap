process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const environment = require('./base')

module.exports = environment.toWebpackConfig()
