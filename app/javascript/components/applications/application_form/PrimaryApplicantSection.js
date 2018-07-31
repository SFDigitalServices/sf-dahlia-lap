import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import classNames from 'classnames'
import moment from 'moment'

import domainToApi from '~/components/mappers/domainToApi'

let { phone_type_options } = formOptions

let mailingAddressFieldMap = {
  address: 'mailingAddress',
  city: 'mailingCity',
  state: 'mailingState',
  zip: 'mailingZip',
}

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
    autofillValues = domainToApi.mapApplicant(editValues.applicant)
    formApi.values.primaryApplicant = autofillValues
  }

  const validateError = (values) => {
    return  {
      'DOB': validates(isOldEnough, "The primary applicant must be 18 years of age or older")(values.DOB)
    }
  }

  return (
    <NestedForm field="primaryApplicant">
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
                  <Text field="firstName" />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middleName" />
                </div>
                <div className="small-4 columns">
                  <label>Last Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text field="lastName" />
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
                <Text field="phone" />
              </div>
              <div className="small-4 columns">
                <label>Phone Type</label>
                <Select field="phoneType" options={phone_type_options} />
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <div className={classNames('form-group', errorClassName(formApi,'DOB'))}>
                  <label className='form-label'>Date of Birth</label>
                  <Text
                    field="DOB"
                    type="date"
                    className={classNames(errorClassName(formApi, 'DOB'))} />
                  <FormError formApi={formApi} field='DOB'/>
                </div>
              </div>
            </div>

            <AddressForm title="Home Address" memberType="primaryApplicant" />
            <AddressForm title="Mailing Address" memberType="primaryApplicant"  fieldMap={mailingAddressFieldMap} />

          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default PrimaryApplicantSection
