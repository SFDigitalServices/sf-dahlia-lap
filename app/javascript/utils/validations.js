import moment from 'moment'
import { mapValues, map } from 'lodash'

const run = (rules, values) =>  {
  return mapValues(rules, (valFn, key) => valFn(values[key]))
}

const validate = (rules) => {
  return (values) => run(rules, values)
}

/* Validations */

const validates = (fun, message) => (value) => {
  return fun(value) ? null : message
}

const decorateValidator = (fn) => {
  return message => validates(fn, message)
}

const isOldEnough = (dateOfBirth) => {
  const years = moment().diff(dateOfBirth,'years')
  return years >= 18
}

const isPresent = (value) => !!value

validate.isOldEnough = decorateValidator(isOldEnough)
validate.isPresent = decorateValidator(isPresent)
validate.all = (fn) => (list) => map(list, fn)

export default validate
