module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:react/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      // look for babel.config.js in current dir, move up a level if not found
      rootMode: 'upward'
    }
  },
  plugins: [
    '@babel',
    'jest',
    'react'
  ],
  rules: {
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',

    // only allow the first letter to be uppercase in 'describe' block descriptions,
    // 'test' and 'it' block descriptions must start with lowercase
    'jest/lowercase-name': ['error', {
      ignore: ['describe']
    }],

    // Ensure you're actually asserting something when calling expect
    'jest/valid-expect': 'error',

    // TODO: turn this back on in future PR
    'jest/prefer-to-have-length': 'off',

    // Don't always require expects, some of our frontend integration tests
    // should pass as long as they don't timeout
    'jest/expect-expect': 'off',

    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/state-in-constructor': 0,
    // eventually I'd like to turn the camelcase rule on for properties,
    // but for now there is enough snake case in our app that this will be a pain.
    camelcase: 'off'
  },
  settings: {
    react: {
      // Must be updated when package.json react version is bumped
      version: '16.9.0'
    }
  }
}
