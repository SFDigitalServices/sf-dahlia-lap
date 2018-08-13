import { map } from 'lodash'

import { validate, isPresent } from '~/utils/validations'

const validatePreference = validate({
  naturalKey: [ isPresent, "is required" ],
  individualPreference: [ isPresent, "is required"],
  preferenceProof: [ isPresent, "is required"],
  address: [ isPresent, "is required"],
  city: [ isPresent, "is required"],
  state: [ isPresent, "is required"],
  zipCode: [ isPresent, "is required"]
})

export const validateError = (values) => {
  return  {
    shortFormPreferences: map(values.shortFormPreferences, validatePreference)
  }
}
