import _ from 'lodash'

// Returns an object whose keys are the form fields and whose
// values indicate whether that field has both been touched
// and has an error. Based on how react-form 2.x works.
// react-form evaluates field errors upon form initialization,
// so for fields that are invalid if blank, react-form assigns
// them errors as soon as the form renders. So this function
// lets us know if fields have errors only after user interaction.
const touchedErrors = (formApi) => {
  return _.reduce(formApi.errors , function(obj, error, field) {
    obj[field] = formApi.touched[field] && error
    return obj;
  }, {});
};

// Returns an object whose keys are the form fields and whose
// values indicate whether that field has an error after a
// form submission has been attempted. Based on how react-form
// 2.x works. react-form evaluates field errors upon form
// initialization, so for fields that are invalid if blank,
// react-form assigns them errors as soon as the form renders.
// So this function lets us know if fields have errors only
// after user has tried to submit the form.
const submitErrors = (formApi) => {
  return formApi.submits > 0 ? formApi.errors : _.mapValues(formApi.errors, () => null)
};

export default {
  touchedErrors,
  submitErrors,
}
