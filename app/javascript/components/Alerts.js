const ERROR_MESSAGE = 'Oops! Looks like something went wrong. Please try again.'

const info = (message) => window.alert(message)

const error = () => window.alert(ERROR_MESSAGE)

export default {
  info,
  error
}
