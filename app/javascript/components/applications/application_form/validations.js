import { validate } from '~/utils/validations'

const validatePreference = validate({
  naturalKey: validate.isPresent("is required"),
  individualPreference: validate.isPresent("is required"),
  preferenceProof: validate.isPresent("is required"),
  address: validate.isPresent("is required"),
  city: validate.isPresent("is required"),
  state: validate.isPresent("is required"),
  zipCode: validate.isPresent("is required")
})

export const validateError = validate({
  shortFormPreferences: validate.all(validatePreference)
})
