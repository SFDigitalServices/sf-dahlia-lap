import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import DatePickerText from './DatePickerText'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import classNames from 'classnames'
import moment from 'moment'
import { mailingAddressFieldMap } from './utils'

let { phone_type_options } = formOptions

const validates = (fun, message) => (value) => {
  return fun(value) ? null : message
}

const isOldEnough = (dateOfBirth) => {
  const years = moment().diff(dateOfBirth,'years')
  return years >= 18
}

const FormError = ({formApi, field }) => {
  if ((formApi.touched[field] || formApi.submitted) && formApi.errors[field])
    return <span className="small error">{formApi.errors[field]}</span>
  else
    return null
}

const errorClassName = (formApi, field) => {
  if (formApi.touched[field] || formApi.submitted)
    return { error: !!formApi.errors[field] }
  else
    return null
}

const PrimaryApplicantSection = ({formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = editValues.applicant
  }

  const validateError = (values) => {
    return  {
      'date_of_birth': validates(isOldEnough, "The primary applicant must be 18 years of age or older")(values.date_of_birth),
      'first_name': !values.first_name ? "Input must contain name" : null
    }
  }

  return (
    <NestedForm field="applicant">
      <Form defaultValues={autofillValues} validateError={validateError} >
        { formApi => (
          <div className="border-bottom margin-bottom--2x">
            <div className="row">
              <h3>Primary Applicant</h3>
            </div>
            <div className="row">
              <div className="form-group">
                <div className="small-4 columns">
                  <label>First Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text field="first_name" />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middle_name" />
                </div>
                <div className="small-4 columns">
                  <label>Last Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text field="last_name" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <label>Email</label>
                <Text field="email" />
              </div>
              <div className="small-4 columns">
                <label>Phone</label>
                <Text field="phone"/>
              </div>
              <div className="small-4 columns">
                <label>Phone Type</label>
                <Select field="phone_type" options={phone_type_options} />
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <div className={classNames('form-group', errorClassName(formApi,'date_of_birth'))}>
                  <label className='form-label'>DOB <span className="checkbox-block_note no-margin">- YYYY-MM-DD (required)</span></label>
                  <DatePickerText
                    required={false}
                    prefilledDate={autofillValues.date_of_birth}
                    dateFormat="YYYY-MM-DD"
                    showYearDropdown
                    dropdownMode="select"
                    className={classNames(errorClassName(formApi, 'date_of_birth'))}
                    field="date_of_birth" />
                  <FormError formApi={formApi} field='date_of_birth'/>
                </div>
              </div>
            </div>
            <AddressForm title="Home Address" memberType="primaryApplicant" />
            <AddressForm title="Mailing Address" memberType="primaryApplicant" fieldMap={mailingAddressFieldMap} />
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default PrimaryApplicantSection
