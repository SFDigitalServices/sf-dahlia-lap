import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

import failOnConsole from 'jest-fail-on-console'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Make vars from the .env file available in process.env
const dotenv = require('dotenv')
dotenv.config()

window.scrollTo = jest.fn()

global.wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms))

// suppress console logs during testing
failOnConsole({
  silenceMessage: (errorMessage) => {
    return true
  }
})
