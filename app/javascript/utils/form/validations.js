import moment from 'moment'
import { mapValues, map, first, compact } from 'lodash'

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

const isValidDate = (dateOfBirth) => {
  if (dateOfBirth) {
    // Check that the date is valid and not in the future
    return moment(dateOfBirth).isValid() && (moment().diff(dateOfBirth, 'days') > 0)
  }
}

const isPresent = (value) => !!value

validate.isOldEnough = decorateValidator(isOldEnough)
validate.isValidDate = decorateValidator(isValidDate)
validate.isPresent = decorateValidator(isPresent)
validate.list = (fn) => (list) => map(list, fn)
validate.any = (...fns) => (value) => {
  return first(
          compact(
            map(fns, fn => fn(value))))
}
export default validate
