import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import validate from '~/utils/form/validations'
import { Field } from '~/utils/form/Field'
import { mailingAddressFieldMap } from './utils'

let { phone_type_options } = formOptions

const validateError = validate({
  DOB: validate.any(
    validate.isValidDate("Please enter a valid Date of Birth"),
    validate.isOldEnough("The primary applicant must be 18 years of age or older")
  ),
  firstName: validate.isPresent("Please enter a First Name"),
  lastName: validate.isPresent("Please enter a Last Name")
})

const PrimaryApplicantSection = ({formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = editValues.applicant
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
                  <Field.Text
                    label="First Name"
                    blockNote="(required)"
                    field="firstName"
                    errorMessage={(label, error) => error }
                  />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middle_name" />
                </div>
                <div className="small-4 columns">
                  <Field.Text
                    label="Last Name"
                    blockNote="(required)"
                    field="lastName"
                    errorMessage={(label, error) => error }
                  />
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
            <AddressForm title="Mailing Address" memberType="primaryApplicant" fieldMap={mailingAddressFieldMap} />
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default PrimaryApplicantSection
