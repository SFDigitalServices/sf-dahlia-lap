import moment from 'moment'
import { map, fromPairs} from 'lodash'

export const validates = (fun, message) => (value) => {
  return fun(value) ? null : message
}

export const isOldEnough = (dateOfBirth) => {
  const years = moment().diff(dateOfBirth,'years')
  return years >= 18
}

export const isPresent = (value) => !!value

export const runValidations = (validateErrors, values) =>  {
  return fromPairs(
    map(validateErrors, (fieldValidation, key) =>
      [key, fieldValidation(values[key])]
    )
  )
}

export const toValidateErrors = (validationsMap) =>  fromPairs(
  map(validationsMap, ([fn, msg], key) => [key, validates(fn, msg)])
)

export const validate = (validationsMap) => {
  const validateErrors = toValidateErrors(validationsMap)
  return (values) => runValidations(validateErrors, values)
}
