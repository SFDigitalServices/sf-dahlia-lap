module.exports = function (api) {
  var validEnv = ['development', 'test', 'production']
  var currentEnv = api.env()
  var isDevelopmentEnv = api.env('development')
  var isProductionEnv = api.env('production')
  var isTestEnv = api.env('test')

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(currentEnv) +
        '.'
    )
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          forceAllTransforms: true,
          useBuiltIns: false,
          modules: false,
          exclude: ['transform-typeof-symbol'],
          targets: isTestEnv && { node: 'current' }
        }
      ],
      [
        require('@babel/preset-react').default,
        {
          development: isDevelopmentEnv || isTestEnv,
          useBuiltIns: true
        }
      ]
    ].filter(Boolean),
    plugins: [
      require('babel-plugin-macros'),
      require('@babel/plugin-syntax-dynamic-import').default,
      [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: false,
          regenerator: true
        }
      ],
      [
        require('@babel/plugin-transform-regenerator').default,
        {
          async: false
        }
      ],
      [
        require('babel-plugin-root-import').default,
        {
          rootPathSuffix: 'app/javascript'
        }
      ],
      isProductionEnv && [
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true
        }
      ]
    ].filter(Boolean)
  }
}
