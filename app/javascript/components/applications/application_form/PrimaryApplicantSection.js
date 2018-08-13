import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'

import { validate, isOldEnough, isPresent } from '~/utils/validations'
import { Field } from '~/utils/errors'
import domainToApi from '~/components/mappers/domainToApi'

let { phone_type_options } = formOptions

let mailingAddressFieldMap = {
  address: 'mailingAddress',
  city: 'mailingCity',
  state: 'mailingState',
  zip: 'mailingZip',
}

const validateError = validate({
  date_of_birth: [ isOldEnough, "The primary applicant must be 18 years of age or older" ],
  first_name: [ isPresent, "Input must contain name" ]
})

const PrimaryApplicantSection = ({formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = domainToApi.mapApplicant(editValues.applicant)
    formApi.values.primaryApplicant = autofillValues
  }

  autofillValues.firstName = "Federico"
  autofillValues.lastName = "Dayan"
  autofillValues.DOB = "1983-03-03"

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
                <Field formApi={formApi} field='DOB' label='DOB' blockNote='- YYYY-MM-DD (required)' >
                  {(field, classNames) => (
                    <Text
                      field="DOB"
                      type="date"
                      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                      placeholder="YYYY-MM-DD"
                      className={classNames} />
                  )}
                </Field>
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
