# Leasing Agent Portal

## To setup:
* Use ruby 2.2.5
* Use node v8.9.1 (npm v5.5.1)
* install yarn (if you have homebrew you can run `brew install yarn`)
* run `yarn install`
* run `bundle install`
* run `./bin/rails webpacker:install`

Ensure you have .babelrc containing the following:
```
{
  "presets": [
    [
      "env",
      {
        "modules": false,
        "targets": {
          "browsers": "> 1%",
          "uglify": true
        },
        "useBuiltIns": true
      }
    ],
    "react"
  ],
  "plugins": [
    "syntax-dynamic-import",
    "transform-object-rest-spread",
    "transform-async-to-generator",
    ["babel-plugin-root-import", {
      "rootPathSuffix": "app/javascript"
    }],
    ["transform-runtime", {
      "polyfill": false,
      "regenerator": true
    }],
    [
      "transform-class-properties",
      {
        "spec": true
      }
    ]
  ]
}

```

## To run server:
* `bin/webpack-dev-server --hot`
* `rails s`

## To update css from Pattern Library:
* `npm run import-styles`