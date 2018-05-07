# Leasing Agent Portal

A portal for leasing agents to manage listings and applications.

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
* `grunt`

# To run tests

Rails tests:

`bundle exec rake spec`

Running React/Javascript tests:

`yarn test`

If you made a legitimate change in the view and a snapshot fails then you have to tell Jest to update the snapshots. Run:

`yarn test -u`

_Note2: Snapshots should be pushed to the repo_
