import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import DatePickerText from './DatePickerText'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import classNames from 'classnames'
import moment from 'moment'

let { phone_type_options } = formOptions

let mailingAddressFieldMap = {
  address: 'mailing_street',
  city: 'mailing_city',
  state: 'mailing_state',
  zip: 'mailing_zip_code',
}

const validates = (fun, message) => (value) => {
  return fun(value) ? null : message
}

const isOldEnough = (dateOfBirth) => {
  const years = moment().diff(dateOfBirth,'years')
  return years >= 18
}

const PrimaryApplicantSection = ({formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = editValues.applicant
  }

  const validateError = (values) => {
    return  {
      'date_of_birth': validates(isOldEnough, "The primary applicant must be 18 years of age or older")(values.date_of_birth)
    }
  }

  return (
    <NestedForm field="applicant">
      <Form defaultValues={autofillValues} validateError={validateError}>
        { formApi => (
          <div className="border-bottom margin-bottom--2x">
            <div className="row">
              <h3>Primary Applicant</h3>
            </div>
            <div className="row">
              <div className="form-group">
                <div className="small-4 columns">
                  <label>First Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text required="true" field="first_name" />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middle_name" />
                </div>
                <div className="small-4 columns">
                  <label>Last Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text required="true" field="last_name" />
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
                <Select field="phone_type" options={phone_type_options}  />
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <div className={classNames('form-group', { 'error': formApi.errors.date_of_birth })}>
                  <label className='form-label'>DOB <span className="checkbox-block_note no-margin">- YYYY-MM-DD (required)</span></label>
                  <DatePickerText
                    required={true}
                    prefilledDate={autofillValues.date_of_birth}
                    dateFormat="YYYY-MM-DD"
                    showYearDropdown
                    dropdownMode="select"
                    className={classNames({ error: formApi.errors.date_of_birth })}
                    field="date_of_birth" />
                  {
                    formApi.errors.date_of_birth &&
                    <span className="small error">{formApi.errors.date_of_birth}</span>
                  }
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
