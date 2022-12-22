/** @type {import('jest').Config} */
module.exports = {
  coverageReporters: ['lcov'],
  clearMocks: true,
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test|e2e).js?(x)'],
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  setupFiles: ['jest-prop-type-error', './spec/javascript/jestsetup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  roots: ['spec/javascript'],
  cache: false,
  resetModules: true,
  moduleDirectories: ['node_modules', 'app/javascript']
}
