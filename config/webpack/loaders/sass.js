const cssnano = require('cssnano')({ preset: 'default' })

// const path = require('path')
// postcss options
let minimize = false
const plugins = [
  require('postcss-flexbugs-fixes'),
  require('postcss-preset-env')({
    autoprefixer: {
      flexbox: 'no-2009'
    },
    stage: 3
  })
]

// eslint-disable-next-line import/order

if (process.env.NODE_ENV === 'production') {
  plugins.push(cssnano)
  minimize = true
}

module.exports = {
  test: /\.(scss|sass)$/,
  use: [
    // 'file-loader',
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    // https://stackoverflow.com/questions/72970312/webpack-wont-compile-when-i-use-an-image-url-in-scss
    { loader: 'css-loader', options: { sourceMap: true } },
    // Various CSS pre and post-processors, including tailwind.
    // See postcss.config.js for specifics
    // This line must come after style/css loaders and before the sass loader
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: plugins,
          minimize: minimize,
          sourceMap: true
        }
      }
    },
    // {
    //   loader: 'resolve-url-loader',
    //   options: {
    //     attempts: 1,
    //     sourceMap: true,
    //     debug: true,
    //     root: path.resolve(__dirname, "../../../app/assets")
    //   }
    // },
    // Compiles Sass to CSS
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ]
}
