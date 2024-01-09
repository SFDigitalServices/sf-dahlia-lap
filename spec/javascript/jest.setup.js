import '@testing-library/jest-dom'

// Make vars from the .env file available in process.env
const dotenv = require('dotenv')
dotenv.config()

window.scrollTo = jest.fn()

global.wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms))
