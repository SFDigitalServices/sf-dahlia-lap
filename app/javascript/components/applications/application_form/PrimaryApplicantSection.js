import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'

import validate from '~/utils/form/validations'
import { Field } from '~/utils/form/Field'
import domainToApi from '~/components/mappers/domainToApi'
import { mailingAddressFieldMap } from './utils'

let { phone_type_options } = formOptions

const validateError = validate({
  DOB: validate.any(
    validate.isValidDate("Please enter a valid date"),
    validate.isOldEnough("The primary applicant must be 18 years of age or older")
  ),
  firstName: validate.isPresent("Input must contain name")
})

const PrimaryApplicantSection = ({formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = domainToApi.mapApplicant(editValues.applicant)
    formApi.values.primaryApplicant = autofillValues
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
                  <Field.Text
                    label="First name"
                    blockNote="(required)"
                    field="firstName"
                    errorMessage={(label, error) => error }
                  />
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
                <Field.Text
                   field='DOB'
                   label='Date of Birth'
                   blockNote='(required)'
                   type="date"
                   pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                   placeholder="YYYY-MM-DD"
                   errorMessage={(label, error) => error }
                />
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
