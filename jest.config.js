/** @type {import('jest').Config} */
const config = {
  cache: false,
  coverageReporters: ['lcov'],
  clearMocks: true,
  moduleDirectories: ['node_modules', 'app/javascript'],
  // resetModules: true,
  roots: ['spec/javascript'],
  setupFiles: ['jest-prop-type-error', './spec/javascript/jestsetup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test|e2e).js?(x)'],
  verbose: true
}

module.exports = config
