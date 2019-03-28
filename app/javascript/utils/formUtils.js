import { reduce, mapValues, isObjectLike, isArray } from 'lodash'

const toOption = (item) => {
  if (isArray(item)) {
    return { value: item[0], label: item[1] }
  } else if (isObjectLike(item)) {
    return item
  } else {
    return { value: item, label: item }
  }
}

const toOptions = (items) => {
  return items.map(toOption)
}

// Returns an object whose keys are the form fields and whose
// values indicate whether that field has both been touched
// and has an error. Based on how react-form 2.x works.
// react-form evaluates field errors upon form initialization,
// so for fields that are invalid if blank, react-form assigns
// them errors as soon as the form renders. So this function
// lets us know if fields have errors only after user interaction.
const touchedErrors = (formApi) => {
  return reduce(formApi.errors, function (obj, error, field) {
    obj[field] = formApi.touched[field] && error
    return obj
  }, {})
}

// Returns an object whose keys are the form fields and whose
// values indicate whether that field has an error after a
// form submission has been attempted. Based on how react-form
// 2.x works. react-form evaluates field errors upon form
// initialization, so for fields that are invalid if blank,
// react-form assigns them errors as soon as the form renders.
// So this function lets us know if fields have errors only
// after user has tried to submit the form.
const submitErrors = (formApi) => {
  return formApi.submits > 0 ? formApi.errors : mapValues(formApi.errors, () => null)
}

export const maxLengthMap = {
  first_name: 40,
  middle_name: 20,
  last_name: 40,
  day: 2,
  month: 2,
  year: 4,
  email: 40,
  password: 50,
  phone: 40,
  address: 75,
  city: 75,
  state: 2,
  zip: 15,
  alternate_contact_type_other: 200,
  agency_name: 250,
  certificate_number: 50,
  gender_other: 100,
  sexual_orientation_other: 100,
  income: 16
}

export default {
  toOption,
  toOptions,
  touchedErrors,
  submitErrors
}
